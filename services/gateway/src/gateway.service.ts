import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GatewayService {
  constructor(
    @Inject('EVENTOS_SERVICE') private eventosClient: ClientProxy,
    @Inject('INSCRIPTIONS_SERVICE') private inscriptionsClient: ClientProxy,
    @Inject('TEAMS_SERVICE') private teamsClient: ClientProxy,
    @Inject('MATCHES_SERVICE') private matchesClient: ClientProxy,
  ) {
    // Teams and Matches clients will be used in future endpoints
    // Using void to mark as intentionally unused for now
    void this.teamsClient;
    void this.matchesClient;
  }

  // Eventos
  async getEvents(organizationId?: string) {
    const payload: any = {};
    if (organizationId) {
      payload.organizationId = organizationId;
    }
    return firstValueFrom(this.eventosClient.send('get_events', payload));
  }

  async getEvent(id: string, organizationId?: string) {
    const payload: any = { id };
    if (organizationId) {
      payload.organizationId = organizationId;
    }
    return firstValueFrom(this.eventosClient.send('get_event', payload));
  }

  // Inscriptions
  async createInscription(data: any) {
    return firstValueFrom(
      this.inscriptionsClient.send('create_inscription', data),
    );
  }

  async getInscription(id: string) {
    return firstValueFrom(
      this.inscriptionsClient.send('get_inscription', { id }),
    );
  }
}


