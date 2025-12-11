import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableLock } from '../entities/table-lock.entity';
import { Table } from '../entities/table.entity';
import { TableStatus } from '@wtt/common';

@Injectable()
export class TableLockService {
  constructor(
    @InjectRepository(TableLock)
    private tableLockRepository: Repository<TableLock>,
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
  ) {}

  /**
   * Bloquea una mesa (solo árbitro autorizado)
   */
  async lockTable(
    eventId: string,
    tableId: string,
    refereeId: string,
    reason?: string,
  ): Promise<TableLock> {
    // Verificar que no esté ya bloqueada por otro árbitro
    const existingLock = await this.tableLockRepository.findOne({
      where: {
        tableId,
        isActive: true,
      },
    });

    if (existingLock && existingLock.refereeId !== refereeId) {
      throw new ConflictException('La mesa ya está bloqueada por otro árbitro');
    }

    // Crear o reactivar bloqueo
    if (existingLock) {
      existingLock.isActive = true;
      existingLock.lockedAt = new Date();
      existingLock.reason = reason;
      return await this.tableLockRepository.save(existingLock);
    }

    const lock = this.tableLockRepository.create({
      eventId,
      tableId,
      refereeId,
      isActive: true,
      lockedAt: new Date(),
      reason,
    });

    await this.tableLockRepository.save(lock);

    // Actualizar estado de la mesa
    await this.tableRepository.update(tableId, {
      status: TableStatus.LOCKED,
      lockedByRefereeId: refereeId,
    });

    return lock;
  }

  /**
   * Desbloquea una mesa
   */
  async unlockTable(tableId: string, refereeId: string): Promise<void> {
    const lock = await this.tableLockRepository.findOne({
      where: {
        tableId,
        refereeId,
        isActive: true,
      },
    });

    if (!lock) {
      throw new NotFoundException('No hay bloqueo activo para esta mesa');
    }

    lock.isActive = false;
    lock.unlockedAt = new Date();
    await this.tableLockRepository.save(lock);

    // Actualizar estado de la mesa
    await this.tableRepository.update(tableId, {
      status: TableStatus.AVAILABLE,
      lockedByRefereeId: null,
    });
  }

  /**
   * Obtiene el bloqueo activo de una mesa
   */
  async getActiveLock(tableId: string): Promise<TableLock | null> {
    return await this.tableLockRepository.findOne({
      where: {
        tableId,
        isActive: true,
      },
    });
  }
}

