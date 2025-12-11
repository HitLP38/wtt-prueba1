import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Table } from '../entities/table.entity';
import { Match } from '../entities/match.entity';
import { TableStatus, TableStatusColor, MatchStatus } from '@wtt/common';

@Injectable()
export class TableStatusService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  /**
   * Calcula el estado actual de una mesa (mantener compatibilidad)
   * @deprecated Usar calculateTableStatus(tableId, organizationId) en su lugar
   */
  async calculateTableStatusLegacy(tableId: string): Promise<TableStatus> {
    const table = await this.tableRepository.findOne({
      where: { id: tableId },
    });

    if (!table) {
      throw new NotFoundException('Mesa no encontrada');
    }

    return this.calculateTableStatusInternal(table);
  }

  /**
   * Calcula progreso esperado basado en tiempo
   */
  private calculateExpectedProgress(matches: Match[]): number {
    if (matches.length === 0) return 0;

    const now = new Date();
    const firstMatch = matches[0];
    const lastMatch = matches[matches.length - 1];

    if (!firstMatch.scheduledTime || !lastMatch.scheduledTime) return 0;

    const totalDuration = lastMatch.scheduledTime.getTime() - firstMatch.scheduledTime.getTime();
    const elapsed = now.getTime() - firstMatch.scheduledTime.getTime();

    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }

  /**
   * Actualiza estado de todas las mesas de un evento
   */
  async updateAllTableStatuses(eventId: string): Promise<void> {
    const tables = await this.tableRepository.find({
      where: { eventId },
    });

    for (const table of tables) {
      const status = await this.calculateTableStatusLegacy(table.id);
      await this.tableRepository.update(table.id, { status });
    }
  }

  /**
   * Obtiene color según estado
   */
  getStatusColor(status: TableStatus): string {
    return TableStatusColor[status];
  }

  /**
   * Obtiene todas las mesas de un evento y organización
   * CRÍTICO: Siempre filtrar por organizationId
   */
  async getEventTables(eventId: string, organizationId: string): Promise<Table[]> {
    return await this.tableRepository.find({
      where: { eventId, organizationId },
      order: { tableNumber: 'ASC' },
    });
  }

  /**
   * Calcula estado de mesa validando organización
   */
  async calculateTableStatus(tableId: string, organizationId: string): Promise<TableStatus> {
    const table = await this.tableRepository.findOne({
      where: { id: tableId, organizationId },
    });

    if (!table) {
      throw new NotFoundException('Mesa no encontrada o no pertenece a la organización');
    }
    // ... resto del código igual
    return this.calculateTableStatusInternal(table);
  }

  /**
   * Método interno sin validación de organización (usado internamente)
   */
  private async calculateTableStatusInternal(table: Table): Promise<TableStatus> {
    // Si está bloqueada
    if (table.lockedByRefereeId) {
      return TableStatus.LOCKED;
    }

    // Obtener partido actual
    const currentMatch = await this.matchRepository.findOne({
      where: {
        tableNumber: table.tableNumber,
        eventId: table.eventId,
        organizationId: table.organizationId, // CRÍTICO: Filtrar por org
        status: In([MatchStatus.IN_PROGRESS, MatchStatus.SCHEDULED]),
      },
      order: { scheduledTime: 'ASC' },
    });

    if (currentMatch?.status === MatchStatus.IN_PROGRESS) {
      const isDelayed = await this.isTableDelayed(table.id, table.organizationId);
      return isDelayed ? TableStatus.DELAYED : TableStatus.IN_PROGRESS;
    }

    return TableStatus.AVAILABLE;
  }

  /**
   * Verifica si una mesa está atrasada (actualizado con organizationId)
   */
  private async isTableDelayed(tableId: string, organizationId: string): Promise<boolean> {
    const table = await this.tableRepository.findOne({
      where: { id: tableId, organizationId },
    });

    if (!table) return false;

    const seriesMatches = await this.matchRepository.find({
      where: {
        tableNumber: table.tableNumber,
        eventId: table.eventId,
        organizationId: table.organizationId, // CRÍTICO: Filtrar por org
      },
      order: { scheduledTime: 'ASC' },
    });

    if (seriesMatches.length === 0) return false;

    const totalMatches = seriesMatches.length;
    const completedMatches = seriesMatches.filter(
      (m) => m.status === MatchStatus.COMPLETED,
    ).length;

    const expectedProgress = this.calculateExpectedProgress(seriesMatches);
    const actualProgress = (completedMatches / totalMatches) * 100;

    return actualProgress < expectedProgress - 20;
  }
}

