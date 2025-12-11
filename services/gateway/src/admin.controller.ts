import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from './guards/auth.guard';
import { OrganizationGuard } from './guards/organization.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentOrg } from './decorators/current-org.decorator';

@Controller('admin')
@UseGuards(AuthGuard, OrganizationGuard, RolesGuard)
@Roles('ADMIN', 'MASTER')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Dashboard principal del administrador
   */
  @Get('dashboard')
  async getDashboard(
    @Query('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.adminService.getDashboard(eventId, organizationId);
  }

  /**
   * Obtener mesas de un evento con estados
   */
  @Get('events/:eventId/tables')
  async getEventTables(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.adminService.getEventTables(eventId, organizationId);
  }

  /**
   * Obtener árbitros de un evento
   */
  @Get('events/:eventId/referees')
  async getEventReferees(@Param('eventId') eventId: string) {
    return this.adminService.getEventReferees(eventId);
  }

  /**
   * Habilitar árbitro para evento
   */
  @Post('events/:eventId/referees/:refereeId/enable')
  async enableReferee(
    @Param('eventId') eventId: string,
    @Param('refereeId') refereeId: string,
    @Body() body: { notes?: string },
    @Query('adminId') adminId: string, // TODO: Obtener de AuthGuard
  ) {
    return this.adminService.enableReferee(eventId, refereeId, adminId, body.notes);
  }

  /**
   * Deshabilitar árbitro para evento
   */
  @Post('events/:eventId/referees/:refereeId/disable')
  async disableReferee(
    @Param('eventId') eventId: string,
    @Param('refereeId') refereeId: string,
    @Body() body: { notes?: string },
  ) {
    return this.adminService.disableReferee(eventId, refereeId, body.notes);
  }

  /**
   * Obtener configuración de evento
   */
  @Get('events/:eventId/settings')
  async getEventSettings(@Param('eventId') eventId: string) {
    return this.adminService.getEventSettings(eventId);
  }

  /**
   * Actualizar configuración de evento
   */
  @Patch('events/:eventId/settings')
  async updateEventSettings(
    @Param('eventId') eventId: string,
    @Body() settings: any,
  ) {
    return this.adminService.updateEventSettings(eventId, settings);
  }

  /**
   * Obtener sugerencias de desdoblamiento
   */
  @Get('events/:eventId/unfolding')
  async getUnfoldingSuggestions(@Param('eventId') eventId: string) {
    return this.adminService.getUnfoldingSuggestions(eventId);
  }

  /**
   * Aplicar desdoblamiento
   */
  @Post('events/:eventId/unfolding/apply')
  async applyUnfolding(
    @Param('eventId') eventId: string,
    @Body() body: { delayedTableId: string; helperTableId: string; matchesToShare: string[] },
  ) {
    return this.adminService.applyUnfolding(
      eventId,
      body.delayedTableId,
      body.helperTableId,
      body.matchesToShare,
    );
  }
}

