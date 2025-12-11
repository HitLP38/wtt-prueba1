import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventConfigService } from '../services/event-config.service';
import { AuthGuard } from '../guards/auth.guard';
import { OrganizationGuard } from '../guards/organization.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentOrg } from '../decorators/current-org.decorator';

@Controller('admin/events/:eventId/config')
@UseGuards(AuthGuard, OrganizationGuard, RolesGuard)
@Roles('ADMIN', 'MASTER')
export class EventConfigController {
  constructor(private readonly eventConfigService: EventConfigService) {}

  // =====================================================
  // CONFIGURACIÓN COMPLETA
  // =====================================================

  @Get()
  async getCompleteConfig(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.eventConfigService.getCompleteConfig(eventId, organizationId);
  }

  @Put()
  async saveCompleteConfig(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
    @Body() config: any,
  ) {
    return this.eventConfigService.saveCompleteConfig(eventId, organizationId, config);
  }

  // =====================================================
  // INFORMACIÓN BÁSICA
  // =====================================================

  @Get('basic-info')
  async getBasicInfo(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.eventConfigService.getBasicInfo(eventId, organizationId);
  }

  @Put('basic-info')
  async saveBasicInfo(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
    @Body() data: any,
  ) {
    return this.eventConfigService.saveBasicInfo(eventId, organizationId, data);
  }

  // =====================================================
  // MODALIDADES Y CATEGORÍAS
  // =====================================================

  @Get('modalities')
  async getModalities(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.eventConfigService.getModalities(eventId, organizationId);
  }

  @Post('modalities')
  async upsertModality(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
    @Body() data: any,
  ) {
    return this.eventConfigService.upsertModality({
      ...data,
      eventId,
      organizationId,
    });
  }

  @Get('categories')
  async getCategories(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
    @Query('modality') modality?: string,
    @Query('gender') gender?: string,
  ) {
    if (modality || gender) {
      return this.eventConfigService.getCategoriesByFilters(
        eventId,
        organizationId,
        modality,
        gender,
      );
    }
    return this.eventConfigService.getCategories(eventId, organizationId);
  }

  @Post('categories')
  async createCategory(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
    @Body() data: any,
  ) {
    return this.eventConfigService.createCategory({
      ...data,
      eventId,
      organizationId,
    });
  }

  @Put('categories/:categoryId')
  async updateCategory(
    @Param('eventId') _eventId: string,
    @Param('categoryId') categoryId: string,
    @CurrentOrg() organizationId: string,
    @Body() data: any,
  ) {
    return this.eventConfigService.updateCategory(categoryId, organizationId, data);
  }

  @Delete('categories/:categoryId')
  async deleteCategory(
    @Param('eventId') _eventId: string,
    @Param('categoryId') categoryId: string,
    @CurrentOrg() organizationId: string,
  ) {
    await this.eventConfigService.deleteCategory(categoryId, organizationId);
    return { success: true };
  }

  // =====================================================
  // SISTEMA DE COMPETENCIA
  // =====================================================

  @Get('competition-system')
  async getCompetitionSystem(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.eventConfigService.getCompetitionSystem(eventId, organizationId);
  }

  @Put('competition-system')
  async saveCompetitionSystem(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
    @Body() data: any,
  ) {
    return this.eventConfigService.saveCompetitionSystem(eventId, organizationId, data);
  }

  // =====================================================
  // PREMIOS
  // =====================================================

  @Get('awards')
  async getAwards(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.eventConfigService.getAwards(eventId, organizationId);
  }

  @Put('awards')
  async saveAwards(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
    @Body() data: any,
  ) {
    return this.eventConfigService.saveAwards(eventId, organizationId, data);
  }

  // =====================================================
  // NORMATIVAS (REGLAS DE SIEMBRA)
  // =====================================================

  @Get('seeding-rules')
  async getSeedingRules(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.eventConfigService.getSeedingRules(eventId, organizationId);
  }

  @Put('seeding-rules')
  async saveSeedingRules(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
    @Body() data: any,
  ) {
    return this.eventConfigService.saveSeedingRules(eventId, organizationId, data);
  }

  // =====================================================
  // INSCRIPCIONES
  // =====================================================

  @Get('registration')
  async getRegistration(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.eventConfigService.getRegistration(eventId, organizationId);
  }

  @Put('registration')
  async saveRegistration(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
    @Body() data: any,
  ) {
    return this.eventConfigService.saveRegistration(eventId, organizationId, data);
  }

  // =====================================================
  // EQUIPAMIENTO
  // =====================================================

  @Get('equipment')
  async getEquipment(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.eventConfigService.getEquipment(eventId, organizationId);
  }

  @Put('equipment')
  async saveEquipment(
    @Param('eventId') eventId: string,
    @CurrentOrg() organizationId: string,
    @Body() data: any,
  ) {
    return this.eventConfigService.saveEquipment(eventId, organizationId, data);
  }
}

