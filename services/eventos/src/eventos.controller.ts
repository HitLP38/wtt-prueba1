import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventosService } from './eventos.service';
import { EventAccessService } from './services/event-access.service';

@Controller()
export class EventosController {
  constructor(
    private readonly eventosService: EventosService,
    private readonly eventAccessService: EventAccessService,
  ) {}

  @MessagePattern('get_events')
  getEvents(@Payload() data: { organizationId?: string }) {
    // Si no hay organizationId, retornar todos (solo para MASTER)
    if (!data.organizationId) {
      return this.eventosService.findAllWithoutFilter();
    }
    return this.eventosService.findAll(data.organizationId);
  }

  @MessagePattern('get_event')
  getEvent(@Payload() data: { id: string; organizationId?: string }) {
    if (!data.organizationId) {
      return this.eventosService.findOneWithoutFilter(data.id);
    }
    return this.eventosService.findOne(data.id, data.organizationId);
  }

  @MessagePattern('create_event')
  createEvent(@Payload() data: any) {
    return this.eventosService.create(data);
  }

  @MessagePattern('get_event_referees')
  getEventReferees(@Payload() data: { eventId: string }) {
    return this.eventAccessService.getEventReferees(data.eventId);
  }

  @MessagePattern('enable_referee_access')
  enableRefereeAccess(@Payload() data: { eventId: string; refereeId: string; enabledBy: string; notes?: string }) {
    return this.eventAccessService.enableAccess(data.eventId, data.refereeId, data.enabledBy, data.notes);
  }

  @MessagePattern('disable_referee_access')
  disableRefereeAccess(@Payload() data: { eventId: string; refereeId: string; notes?: string }) {
    return this.eventAccessService.disableAccess(data.eventId, data.refereeId, data.notes);
  }
}


