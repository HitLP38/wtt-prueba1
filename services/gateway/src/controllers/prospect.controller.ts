import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ProspectService } from '../services/prospect.service';
import { AuthGuard } from '../guards/auth.guard';
import { OrganizationGuard } from '../guards/organization.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentOrg } from '../decorators/current-org.decorator';

@Controller('admin/events/:eventId/prospects')
@UseGuards(AuthGuard, OrganizationGuard, RolesGuard)
@Roles('ADMIN', 'MASTER')
export class ProspectController {
  constructor(private readonly prospectService: ProspectService) {}

  /**
   * Generar nuevo prospecto PDF
   */
  @Post()
  async generateProspect(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
    @Query('userId') userId: string, // TODO: Obtener del token
  ) {
    return this.prospectService.generateProspect(eventId, organizationId, userId);
  }

  /**
   * Listar prospectos de un evento
   */
  @Get()
  async getEventProspects(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.prospectService.getEventProspects(eventId, organizationId);
  }

  /**
   * Obtener prospecto por ID
   */
  @Get(':id')
  async getProspect(
    @Param('eventId') _eventId: string,
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.prospectService.getProspect(id, organizationId);
  }

  /**
   * Descargar PDF del prospecto
   */
  @Get(':id/download')
  async downloadProspect(
    @Param('eventId') _eventId: string,
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
    @Res() res: Response,
  ) {
    const { buffer, fileName } = await this.prospectService.getPdfFile(id, organizationId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  }
}

