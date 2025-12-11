import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RefereeService {
  constructor(
    @Inject('EVENTOS_SERVICE') private eventosClient: ClientProxy,
    @Inject('MATCHES_SERVICE') private matchesClient: ClientProxy,
  ) {}

  async getAccessibleEvents(refereeId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_accessible_events', { refereeId }),
    );
  }

  async getAssignedMatches(eventId: string, refereeId: string) {
    return firstValueFrom(
      this.matchesClient.send('get_referee_matches', { eventId, refereeId }),
    );
  }

  async lockTable(
    eventId: string,
    tableId: string,
    refereeId: string,
    reason?: string,
  ) {
    return firstValueFrom(
      this.matchesClient.send('lock_table', {
        eventId,
        tableId,
        refereeId,
        reason,
      }),
    );
  }

  async unlockTable(tableId: string, refereeId: string) {
    return firstValueFrom(
      this.matchesClient.send('unlock_table', { tableId, refereeId }),
    );
  }

  async startMatch(matchId: string) {
    return firstValueFrom(
      this.matchesClient.send('start_match', { matchId }),
    );
  }

  async getMatchScore(matchId: string) {
    return firstValueFrom(
      this.matchesClient.send('get_match_score', { matchId }),
    );
  }

  async updateSetScore(
    matchId: string,
    setNumber: number,
    player1Score: number,
    player2Score: number,
  ) {
    return firstValueFrom(
      this.matchesClient.send('update_set_score', {
        matchId,
        setNumber,
        player1Score,
        player2Score,
      }),
    );
  }

  async completeMatch(matchId: string) {
    return firstValueFrom(
      this.matchesClient.send('complete_match', { matchId }),
    );
  }
}

