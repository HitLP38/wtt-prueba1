import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProspectService {
  constructor(
    @Inject('EVENTOS_SERVICE') private eventosClient: ClientProxy,
  ) {}

  async generateProspect(eventId: string, organizationId: string, userId: string) {
    return firstValueFrom(
      this.eventosClient.send('generate_prospect', { eventId, organizationId, userId }),
    );
  }

  async getProspect(id: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_prospect', { id, organizationId }),
    );
  }

  async getEventProspects(eventId: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_event_prospects', { eventId, organizationId }),
    );
  }

  async getPdfFile(id: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_prospect_pdf', { id, organizationId }),
    );
  }
}

