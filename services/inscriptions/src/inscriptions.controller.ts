import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InscriptionsService } from './inscriptions.service';
import { InscriptionStatus } from '@wtt/common';

@Controller()
export class InscriptionsController {
  constructor(private readonly inscriptionsService: InscriptionsService) {}

  @MessagePattern('create_inscription')
  createInscription(@Payload() data: any) {
    return this.inscriptionsService.create(data);
  }

  @MessagePattern('get_inscription')
  getInscription(@Payload() data: { id: string }) {
    return this.inscriptionsService.findOne(data.id);
  }

  @MessagePattern('validate_inscription')
  validateInscription(@Payload() data: { id: string; status: string; reason?: string }) {
    return this.inscriptionsService.validate(
      data.id,
      data.status as InscriptionStatus,
      data.reason,
    );
  }
}


