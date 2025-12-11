import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TemplateService {
  constructor(
    @Inject('EVENTOS_SERVICE') private eventosClient: ClientProxy,
  ) {}

  async createTemplate(data: any) {
    return firstValueFrom(this.eventosClient.send('create_template', data));
  }

  async search(organizationId: string, filters: any) {
    return firstValueFrom(
      this.eventosClient.send('search_templates', { organizationId, filters }),
    );
  }

  async getTemplate(id: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_template', { id, organizationId }),
    );
  }

  async getMyTemplates(organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_my_templates', { organizationId }),
    );
  }

  async getPublicTemplates() {
    return firstValueFrom(this.eventosClient.send('get_public_templates', {}));
  }

  async useTemplate(templateId: string, organizationId: string, userId: string) {
    return firstValueFrom(
      this.eventosClient.send('use_template', { templateId, organizationId, userId }),
    );
  }

  async updateTemplate(data: { id: string; organizationId: string; userId: string; data: any }) {
    return firstValueFrom(this.eventosClient.send('update_template', data));
  }

  async deleteTemplate(id: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('delete_template', { id, organizationId }),
    );
  }

  async getTemplateVersions(templateId: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_template_versions', { templateId, organizationId }),
    );
  }

  async getTemplateVersion(templateId: string, version: number, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_template_version', { templateId, version, organizationId }),
    );
  }

  async compareTemplateVersions(data: {
    templateId: string;
    version1: number;
    version2: number;
    organizationId: string;
  }) {
    return firstValueFrom(
      this.eventosClient.send('compare_template_versions', data),
    );
  }
}

