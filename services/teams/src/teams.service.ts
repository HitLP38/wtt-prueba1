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

  async create(data: Partial<Team>) {
    const team = this.teamRepository.create(data);
    return this.teamRepository.save(team);
  }

  async findOne(id: string) {
    return this.teamRepository.findOne({ where: { id } });
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


