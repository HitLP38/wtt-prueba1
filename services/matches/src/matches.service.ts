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

  async create(data: Partial<Match>) {
    const match = this.matchRepository.create({
      ...data,
      status: MatchStatus.SCHEDULED,
    });
    return this.matchRepository.save(match);
  }

  async findOne(id: string) {
    return this.matchRepository.findOne({ where: { id } });
  }

  async assignTable(matchId: string, tableNumber: number) {
    const match = await this.findOne(matchId);
    if (!match) {
      throw new Error('Match not found');
    }
    match.tableNumber = tableNumber;
    return this.matchRepository.save(match);
  }

  async startMatch(matchId: string, refereeId: string) {
    const match = await this.findOne(matchId);
    if (!match) {
      throw new Error('Match not found');
    }
    match.status = MatchStatus.IN_PROGRESS;
    match.refereeId = refereeId;
    match.startedAt = new Date();
    return this.matchRepository.save(match);
  }
}


