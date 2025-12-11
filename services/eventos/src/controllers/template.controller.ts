import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TemplateService } from '../services/template.service';

@Controller()
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  // =====================================================
  // PLANTILLAS
  // =====================================================

  @MessagePattern('create_template')
  async createTemplate(@Payload() data: any) {
    return this.templateService.create(data.organizationId, data);
  }

  @MessagePattern('search_templates')
  async searchTemplates(@Payload() data: { organizationId: string; filters: any }) {
    return this.templateService.search(data.organizationId, data.filters);
  }

  @MessagePattern('get_template')
  async getTemplate(@Payload() data: { id: string; organizationId: string }) {
    return this.templateService.findOne(data.id, data.organizationId);
  }

  @MessagePattern('get_my_templates')
  async getMyTemplates(@Payload() data: { organizationId: string }) {
    return this.templateService.findByOrganization(data.organizationId);
  }

  @MessagePattern('get_public_templates')
  async getPublicTemplates() {
    return this.templateService.findPublic();
  }

  @MessagePattern('use_template')
  async useTemplate(@Payload() data: { templateId: string; organizationId: string; userId: string }) {
    return this.templateService.useTemplate(data.templateId, data.organizationId, data.userId);
  }

  @MessagePattern('update_template')
  async updateTemplate(@Payload() data: { id: string; organizationId: string; userId: string; data: any }) {
    return this.templateService.update(data.id, data.organizationId, data.userId, data.data);
  }

  @MessagePattern('delete_template')
  async deleteTemplate(@Payload() data: { id: string; organizationId: string }) {
    await this.templateService.remove(data.id, data.organizationId);
    return { success: true };
  }

  // =====================================================
  // VERSIONES
  // =====================================================

  @MessagePattern('get_template_versions')
  async getTemplateVersions(@Payload() data: { templateId: string; organizationId: string }) {
    return this.templateService.getVersions(data.templateId, data.organizationId);
  }

  @MessagePattern('get_template_version')
  async getTemplateVersion(@Payload() data: { templateId: string; version: number; organizationId: string }) {
    return this.templateService.getVersion(data.templateId, data.version, data.organizationId);
  }

  @MessagePattern('compare_template_versions')
  async compareTemplateVersions(@Payload() data: { templateId: string; version1: number; version2: number; organizationId: string }) {
    return this.templateService.compareVersions(
      data.templateId,
      data.version1,
      data.version2,
      data.organizationId,
    );
  }
}

