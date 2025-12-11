import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { MatchStatus } from '@wtt/common';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  /**
   * Crear partido (debe incluir organizationId)
   */
  async create(data: Partial<Match>) {
    if (!data.organizationId) {
      throw new Error('organizationId es requerido');
    }
    const match = this.matchRepository.create({
      ...data,
      status: MatchStatus.SCHEDULED,
    });
    return this.matchRepository.save(match);
  }

  /**
   * Buscar partido por ID y organización
   * CRÍTICO: Validar que pertenezca a la organización
   */
  async findOne(id: string, organizationId?: string) {
    const where: any = { id };
    if (organizationId) {
      where.organizationId = organizationId; // Filtrar por organización si se proporciona
    }
    return this.matchRepository.findOne({ where });
  }

  /**
   * Asignar mesa a partido
   */
  async assignTable(matchId: string, tableNumber: number, organizationId: string) {
    const match = await this.findOne(matchId, organizationId);
    if (!match) {
      throw new Error('Match not found or does not belong to organization');
    }
    match.tableNumber = tableNumber;
    return this.matchRepository.save(match);
  }

  /**
   * Iniciar partido
   */
  async startMatch(matchId: string, refereeId: string, organizationId: string) {
    const match = await this.findOne(matchId, organizationId);
    if (!match) {
      throw new Error('Match not found or does not belong to organization');
    }
    match.status = MatchStatus.IN_PROGRESS;
    match.refereeId = refereeId;
    match.startedAt = new Date();
    return this.matchRepository.save(match);
  }

  /**
   * Buscar partidos por evento y organización
   * CRÍTICO: Siempre filtrar por organizationId
   */
  async findByEvent(eventId: string, organizationId: string) {
    return this.matchRepository.find({
      where: { eventId, organizationId },
      order: { scheduledTime: 'ASC' },
    });
  }

  /**
   * Buscar todos los partidos de una organización
   */
  async findByOrganization(organizationId: string) {
    return this.matchRepository.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
    });
  }
}


