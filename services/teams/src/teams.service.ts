import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamLineup } from './entities/team-lineup.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamLineup)
    private lineupRepository: Repository<TeamLineup>,
  ) {}

  /**
   * Crear equipo (debe incluir organizationId)
   */
  async create(data: Partial<Team>) {
    if (!data.organizationId) {
      throw new Error('organizationId es requerido');
    }
    const team = this.teamRepository.create(data);
    return this.teamRepository.save(team);
  }

  /**
   * Buscar equipo por ID y organización
   * CRÍTICO: Validar que pertenezca a la organización
   */
  async findOne(id: string, organizationId?: string) {
    const where: any = { id };
    if (organizationId) {
      where.organizationId = organizationId;
    }
    return this.teamRepository.findOne({ where });
  }

  /**
   * Buscar equipos por evento y organización
   * CRÍTICO: Siempre filtrar por organizationId
   */
  async findByEvent(eventId: string, organizationId: string) {
    return this.teamRepository.find({
      where: { eventId, organizationId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Buscar todos los equipos de una organización
   */
  async findByOrganization(organizationId: string) {
    return this.teamRepository.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
    });
  }

  async createLineup(data: Partial<TeamLineup>) {
    const lineup = this.lineupRepository.create(data);
    const savedLineup = await this.lineupRepository.save(lineup);
    
    // Validar automáticamente
    const validation = await this.validateLineup(savedLineup.id);
    savedLineup.isValid = validation.isValid;
    savedLineup.validationErrors = validation.errors;
    
    return this.lineupRepository.save(savedLineup);
  }

  async validateLineup(lineupId: string) {
    const lineup = await this.lineupRepository.findOne({
      where: { id: lineupId },
      relations: ['team'],
    });

    if (!lineup) {
      throw new Error('Lineup not found');
    }

    const errors: string[] = [];
    const players = [
      lineup.s1PlayerId,
      lineup.s2PlayerId,
      lineup.dPlayer1Id,
      lineup.dPlayer2Id,
      lineup.s3PlayerId,
      lineup.s4PlayerId,
    ];

    // Validar jugadores únicos
    const uniquePlayers = new Set(players);
    if (uniquePlayers.size !== players.length) {
      errors.push('Un jugador no puede estar en múltiples posiciones');
    }

    // Validar que todos los jugadores pertenezcan al equipo
    // TODO: Implementar validación completa con base de datos

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}


