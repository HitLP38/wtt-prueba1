import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PdfGeneratorService } from '../services/pdf-generator.service';

@Controller()
export class ProspectController {
  constructor(private readonly pdfGeneratorService: PdfGeneratorService) {}

  @MessagePattern('generate_prospect')
  async generateProspect(@Payload() data: {
    eventId: string;
    organizationId: string;
    userId: string;
  }) {
    return this.pdfGeneratorService.generateProspect(
      data.eventId,
      data.organizationId,
      data.userId,
    );
  }

  @MessagePattern('get_prospect')
  async getProspect(@Payload() data: { id: string; organizationId: string }) {
    return this.pdfGeneratorService.getProspect(data.id, data.organizationId);
  }

  @MessagePattern('get_event_prospects')
  async getEventProspects(@Payload() data: { eventId: string; organizationId: string }) {
    return this.pdfGeneratorService.getEventProspects(data.eventId, data.organizationId);
  }

  @MessagePattern('get_prospect_pdf')
  async getProspectPdf(@Payload() data: { id: string; organizationId: string }) {
    return this.pdfGeneratorService.getPdfFile(data.id, data.organizationId);
  }
}

