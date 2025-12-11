import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TemplateService } from '../services/template.service';
import { AuthGuard } from '../guards/auth.guard';
import { OrganizationGuard } from '../guards/organization.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentOrg } from '../decorators/current-org.decorator';

@Controller('admin/templates')
@UseGuards(AuthGuard, OrganizationGuard, RolesGuard)
@Roles('ADMIN', 'MASTER')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  /**
   * Búsqueda de plantillas con filtros
   */
  @Get('search')
  async searchTemplates(
    @CurrentOrg() organizationId: string,
    @Query('query') query?: string,
    @Query('category') category?: string,
    @Query('isPublic') isPublic?: string,
    @Query('tags') tags?: string, // Coma separada: "oficial,2025"
    @Query('includeMyTemplates') includeMyTemplates?: string,
    @Query('includePublicTemplates') includePublicTemplates?: string,
  ) {
    const filters: any = {};

    if (query) filters.query = query;
    if (category) filters.category = category;
    if (isPublic !== undefined) filters.isPublic = isPublic === 'true';
    if (tags) filters.tags = tags.split(',').map((t) => t.trim());
    if (includeMyTemplates) filters.includeMyTemplates = includeMyTemplates === 'true';
    if (includePublicTemplates) filters.includePublicTemplates = includePublicTemplates === 'true';

    return this.templateService.search(organizationId, filters);
  }

  /**
   * Listar mis plantillas
   */
  @Get('my')
  async getMyTemplates(@CurrentOrg() organizationId: string) {
    return this.templateService.getMyTemplates(organizationId);
  }

  /**
   * Listar plantillas públicas
   */
  @Get('public')
  async getPublicTemplates() {
    return this.templateService.getPublicTemplates();
  }

  /**
   * Obtener plantilla por ID
   */
  @Get(':id')
  async getTemplate(@Param('id') id: string, @CurrentOrg() organizationId: string) {
    return this.templateService.getTemplate(id, organizationId);
  }

  /**
   * Crear nueva plantilla desde configuración
   */
  @Post()
  async createTemplate(
    @CurrentOrg() organizationId: string,
    @Body() data: any,
    @Query('userId') userId: string, // TODO: Obtener del token
  ) {
    return this.templateService.createTemplate({
      ...data,
      organizationId,
      createdBy: userId,
    });
  }

  /**
   * Actualizar plantilla (crea nueva versión)
   */
  @Put(':id')
  async updateTemplate(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
    @Body() data: any,
    @Query('userId') userId: string, // TODO: Obtener del token
  ) {
    return this.templateService.updateTemplate({
      id,
      organizationId,
      userId,
      data,
    });
  }

  /**
   * Eliminar plantilla
   */
  @Delete(':id')
  async deleteTemplate(@Param('id') id: string, @CurrentOrg() organizationId: string) {
    return this.templateService.deleteTemplate(id, organizationId);
  }

  /**
   * Usar plantilla (cargar configuración)
   */
  @Post(':id/use')
  async useTemplate(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
    @Query('userId') userId: string, // TODO: Obtener del token
  ) {
    return this.templateService.useTemplate(id, organizationId, userId);
  }

  /**
   * Obtener versiones de una plantilla
   */
  @Get(':id/versions')
  async getTemplateVersions(@Param('id') id: string, @CurrentOrg() organizationId: string) {
    return this.templateService.getTemplateVersions(id, organizationId);
  }

  /**
   * Obtener versión específica
   */
  @Get(':id/versions/:version')
  async getTemplateVersion(
    @Param('id') id: string,
    @Param('version') version: number,
    @CurrentOrg() organizationId: string,
  ) {
    return this.templateService.getTemplateVersion(id, version, organizationId);
  }

  /**
   * Comparar dos versiones
   */
  @Get(':id/versions/:version1/compare/:version2')
  async compareTemplateVersions(
    @Param('id') id: string,
    @Param('version1') version1: number,
    @Param('version2') version2: number,
    @CurrentOrg() organizationId: string,
  ) {
    return this.templateService.compareTemplateVersions({
      templateId: id,
      version1,
      version2,
      organizationId,
    });
  }
}

