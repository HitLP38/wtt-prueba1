import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'gateway' };
  }

  // Eventos routes
  @Get('events')
  getEvents() {
    return this.gatewayService.getEvents();
  }

  @Get('events/:id')
  getEvent(@Param('id') id: string) {
    return this.gatewayService.getEvent(id);
  }

  // Inscriptions routes
  @Post('inscriptions')
  createInscription(@Body() data: any) {
    return this.gatewayService.createInscription(data);
  }

  @Get('inscriptions/:id')
  getInscription(@Param('id') id: string) {
    return this.gatewayService.getInscription(id);
  }
}


