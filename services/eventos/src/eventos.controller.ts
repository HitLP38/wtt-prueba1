import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventosService } from './eventos.service';

@Controller()
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @MessagePattern('get_events')
  getEvents() {
    return this.eventosService.findAll();
  }

  @MessagePattern('get_event')
  getEvent(@Payload() data: { id: string }) {
    return this.eventosService.findOne(data.id);
  }

  @MessagePattern('create_event')
  createEvent(@Payload() data: any) {
    return this.eventosService.create(data);
  }
}


