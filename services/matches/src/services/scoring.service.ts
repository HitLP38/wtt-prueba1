import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../entities/match.entity';
import { Set } from '../entities/set.entity';
import { MatchStatus, SET_POINTS_TO_WIN, MIN_POINT_DIFFERENCE } from '@wtt/common';

@Injectable()
export class ScoringService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Set)
    private setRepository: Repository<Set>,
  ) {}

  /**
   * Inicia un nuevo set
   */
  async startSet(matchId: string, setNumber: number): Promise<Set> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Partido no encontrado');
    }

    const existingSet = await this.setRepository.findOne({
      where: { matchId, setNumber },
    });

    if (existingSet) {
      return existingSet;
    }

    const set = this.setRepository.create({
      matchId,
      setNumber,
      player1Score: 0,
      player2Score: 0,
      isCompleted: false,
      startedAt: new Date(),
    });

    return await this.setRepository.save(set);
  }

  /**
   * Actualiza puntuación de un set
   */
  async updateScore(
    matchId: string,
    setNumber: number,
    player1Score: number,
    player2Score: number,
  ): Promise<Set> {
    let set = await this.setRepository.findOne({
      where: { matchId, setNumber },
    });

    if (!set) {
      set = await this.startSet(matchId, setNumber);
    }

    set.player1Score = player1Score;
    set.player2Score = player2Score;

    // Verificar si el set está completado
    const isSetWon = this.checkSetCompleted(player1Score, player2Score);
    if (isSetWon && !set.isCompleted) {
      set.isCompleted = true;
      set.completedAt = new Date();
    }

    return await this.setRepository.save(set);
  }

  /**
   * Verifica si un set está completado (ITTF rules)
   */
  private checkSetCompleted(
    score1: number,
    score2: number,
  ): boolean {
    // Un jugador gana con 11 puntos y diferencia de 2, o 10-10 se juega hasta diferencia de 2
    const maxScore = Math.max(score1, score2);
    const minScore = Math.min(score1, score2);

    if (maxScore >= SET_POINTS_TO_WIN) {
      if (maxScore - minScore >= MIN_POINT_DIFFERENCE) {
        return true;
      }
    }

    return false;
  }

  /**
   * Obtiene sets de un partido
   */
  async getMatchSets(matchId: string): Promise<Set[]> {
    return await this.setRepository.find({
      where: { matchId },
      order: { setNumber: 'ASC' },
    });
  }

  /**
   * Verifica si el partido está completado
   */
  async checkMatchCompleted(matchId: string, setsToWin: number): Promise<boolean> {
    const sets = await this.getMatchSets(matchId);
    const completedSets = sets.filter((s) => s.isCompleted);

    let player1Wins = 0;
    let player2Wins = 0;

    for (const set of completedSets) {
      if (set.player1Score > set.player2Score) {
        player1Wins++;
      } else {
        player2Wins++;
      }
    }

    return player1Wins >= setsToWin || player2Wins >= setsToWin;
  }

  /**
   * Finaliza un partido
   */
  async completeMatch(matchId: string): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Partido no encontrado');
    }

    match.status = MatchStatus.COMPLETED;
    match.completedAt = new Date();

    if (match.startedAt) {
      const duration = match.completedAt.getTime() - match.startedAt.getTime();
      match.actualDuration = Math.round(duration / 60000); // En minutos
    }

    return await this.matchRepository.save(match);
  }

  /**
   * Obtiene estadísticas del partido
   */
  async getMatchStats(matchId: string): Promise<{
    sets: Set[];
    player1Wins: number;
    player2Wins: number;
    currentSet: number;
  }> {
    const sets = await this.getMatchSets(matchId);

    let player1Wins = 0;
    let player2Wins = 0;
    let currentSet = 1;

    for (const set of sets) {
      if (set.isCompleted) {
        if (set.player1Score > set.player2Score) {
          player1Wins++;
        } else {
          player2Wins++;
        }
        currentSet = set.setNumber + 1;
      } else {
        currentSet = set.setNumber;
        break;
      }
    }

    return {
      sets,
      player1Wins,
      player2Wins,
      currentSet,
    };
  }
}

