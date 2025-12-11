import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AdminService {
  constructor(
    @Inject('EVENTOS_SERVICE') private eventosClient: ClientProxy,
    @Inject('MATCHES_SERVICE') private matchesClient: ClientProxy,
  ) {}

  async getDashboard(eventId: string, organizationId: string) {
    // Obtener estadísticas del dashboard
    const [event, tables, matches] = await Promise.all([
      firstValueFrom(
        this.eventosClient.send('get_event', { id: eventId, organizationId }),
      ),
      firstValueFrom(
        this.matchesClient.send('get_event_tables', { eventId, organizationId }),
      ),
      firstValueFrom(
        this.matchesClient.send('get_event_matches', { eventId, organizationId }),
      ),
    ]);

    return {
      event,
      tables: tables || [],
      matches: matches || [],
      statistics: {
        totalTables: tables?.length || 0,
        activeMatches: matches?.filter((m: any) => m.status === 'in_progress').length || 0,
        completedMatches: matches?.filter((m: any) => m.status === 'completed').length || 0,
      },
    };
  }

  async getEventTables(eventId: string, organizationId: string) {
    return firstValueFrom(
      this.matchesClient.send('get_event_tables', { eventId, organizationId }),
    );
  }

  async getEventReferees(eventId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_event_referees', { eventId }),
    );
  }

  async enableReferee(
    eventId: string,
    refereeId: string,
    adminId: string,
    notes?: string,
  ) {
    return firstValueFrom(
      this.eventosClient.send('enable_referee_access', {
        eventId,
        refereeId,
        enabledBy: adminId,
        notes,
      }),
    );
  }

  async disableReferee(eventId: string, refereeId: string, notes?: string) {
    return firstValueFrom(
      this.eventosClient.send('disable_referee_access', {
        eventId,
        refereeId,
        notes,
      }),
    );
  }

  async getEventSettings(eventId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_event_settings', { eventId }),
    );
  }

  async updateEventSettings(eventId: string, settings: any) {
    return firstValueFrom(
      this.eventosClient.send('update_event_settings', {
        eventId,
        settings,
      }),
    );
  }

  async getUnfoldingSuggestions(eventId: string) {
    return firstValueFrom(
      this.matchesClient.send('get_unfolding_suggestions', { eventId }),
    );
  }

  async applyUnfolding(
    eventId: string,
    delayedTableId: string,
    helperTableId: string,
    matchesToShare: string[],
  ) {
    return firstValueFrom(
      this.matchesClient.send('apply_unfolding', {
        eventId,
        delayedTableId,
        helperTableId,
        matchesToShare,
      }),
    );
  }
}

