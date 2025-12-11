import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigurationTemplate, TemplateCategory } from '../entities/configuration-template.entity';
import { TemplateVersion } from '../entities/template-version.entity';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(ConfigurationTemplate)
    private templateRepository: Repository<ConfigurationTemplate>,
    @InjectRepository(TemplateVersion)
    private versionRepository: Repository<TemplateVersion>,
  ) {}

  /**
   * Crear nueva plantilla desde configuración de evento
   */
  async create(
    organizationId: string,
    data: {
      name: string;
      description?: string;
      category?: TemplateCategory;
      isPublic?: boolean;
      tags?: string[];
      eventId?: string;
      createdBy: string;
      config: {
        basicInfo: any;
        modalities: any[];
        categories: any[];
        competitionSystem: any;
        awards: any;
        seedingRules: any;
        registration: any;
        equipment: any;
      };
    },
  ): Promise<ConfigurationTemplate> {
    const template = this.templateRepository.create({
      organizationId,
      eventId: data.eventId,
      name: data.name,
      description: data.description,
      category: data.category || TemplateCategory.CUSTOM,
      isPublic: data.isPublic || false,
      tags: data.tags || [],
      version: 1,
      createdBy: data.createdBy,
      basicInfo: data.config.basicInfo,
      modalities: data.config.modalities,
      categories: data.config.categories,
      competitionSystem: data.config.competitionSystem,
      awards: data.config.awards,
      seedingRules: data.config.seedingRules,
      registration: data.config.registration,
      equipment: data.config.equipment,
    });

    const savedTemplate = await this.templateRepository.save(template);

    // Crear primera versión
    await this.createVersion(savedTemplate.id, data.createdBy, [], savedTemplate);

    return savedTemplate;
  }

  /**
   * Buscar plantillas con filtros avanzados
   */
  async search(
    organizationId: string,
    filters: {
      query?: string; // Búsqueda en nombre/descripción
      category?: TemplateCategory;
      isPublic?: boolean;
      tags?: string[];
      includeMyTemplates?: boolean; // Incluir plantillas propias
      includePublicTemplates?: boolean; // Incluir plantillas públicas
    },
  ): Promise<ConfigurationTemplate[]> {
    // Búsqueda por texto (nombre o descripción)
    const queryBuilder = this.templateRepository.createQueryBuilder('template');
    
    // Búsqueda por texto (nombre o descripción)
    if (filters.query) {
      queryBuilder.where(
        '(template.name ILIKE :query OR template.description ILIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    // Filtrar por organización o públicas
    if (filters.includeMyTemplates && filters.includePublicTemplates) {
      // Buscar en mis plantillas Y públicas
      if (filters.query) {
        queryBuilder.andWhere(
          '(template.organizationId = :organizationId OR template.isPublic = true)',
          { organizationId },
        );
      } else {
        queryBuilder.where(
          '(template.organizationId = :organizationId OR template.isPublic = true)',
          { organizationId },
        );
      }
    } else if (filters.includeMyTemplates) {
      if (filters.query) {
        queryBuilder.andWhere('template.organizationId = :organizationId', { organizationId });
      } else {
        queryBuilder.where('template.organizationId = :organizationId', { organizationId });
      }
    } else if (filters.includePublicTemplates) {
      if (filters.query) {
        queryBuilder.andWhere('template.isPublic = true');
      } else {
        queryBuilder.where('template.isPublic = true');
      }
    } else {
      // Por defecto, solo las mías
      if (filters.query) {
        queryBuilder.andWhere('template.organizationId = :organizationId', { organizationId });
      } else {
        queryBuilder.where('template.organizationId = :organizationId', { organizationId });
      }
    }

    // Filtro por categoría
    if (filters.category) {
      queryBuilder.andWhere('template.category = :category', { category: filters.category });
    }

    // Filtro por isPublic específico
    if (filters.isPublic !== undefined && !(filters.includeMyTemplates && filters.includePublicTemplates)) {
      queryBuilder.andWhere('template.isPublic = :isPublic', { isPublic: filters.isPublic });
    }

    if (filters.tags && filters.tags.length > 0) {
      // Búsqueda por tags usando el operador @> de PostgreSQL
      queryBuilder.andWhere('template.tags && :tags', { tags: filters.tags });
    }

    queryBuilder.andWhere('template.isActive = true');
    queryBuilder.orderBy('template.usageCount', 'DESC'); // Más usadas primero
    queryBuilder.addOrderBy('template.lastUsedAt', 'DESC'); // Más recientes
    queryBuilder.addOrderBy('template.createdAt', 'DESC');

    return await queryBuilder.getMany();
  }

  /**
   * Obtener plantilla por ID
   */
  async findOne(id: string, organizationId: string): Promise<ConfigurationTemplate> {
    const template = await this.templateRepository.findOne({
      where: [
        { id, organizationId }, // Mi plantilla
        { id, isPublic: true }, // O plantilla pública
      ],
    });

    if (!template) {
      throw new NotFoundException('Plantilla no encontrada o no tienes acceso');
    }

    return template;
  }

  /**
   * Listar mis plantillas
   */
  async findByOrganization(organizationId: string): Promise<ConfigurationTemplate[]> {
    return await this.templateRepository.find({
      where: { organizationId, isActive: true },
      order: { lastUsedAt: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Listar plantillas públicas
   */
  async findPublic(): Promise<ConfigurationTemplate[]> {
    return await this.templateRepository.find({
      where: { isPublic: true, isActive: true },
      order: { usageCount: 'DESC', createdAt: 'DESC' },
      take: 50, // Límite de 50 plantillas públicas
    });
  }

  /**
   * Usar plantilla (cargar configuración)
   */
  async useTemplate(
    templateId: string,
    organizationId: string,
    _userId: string,
  ): Promise<ConfigurationTemplate> {
    const template = await this.findOne(templateId, organizationId);

    // Incrementar contador de uso
    template.usageCount += 1;
    template.lastUsedAt = new Date();
    await this.templateRepository.save(template);

    return template;
  }

  /**
   * Actualizar plantilla (crea nueva versión automáticamente)
   */
  async update(
    id: string,
    organizationId: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      category?: TemplateCategory;
      isPublic?: boolean;
      tags?: string[];
      config?: any;
      changeNotes?: string; // Notas sobre los cambios
    },
  ): Promise<ConfigurationTemplate> {
    const template = await this.findOne(id, organizationId);

    // Si solo la organización puede actualizarla
    if (template.organizationId !== organizationId) {
      throw new ConflictException('Solo puedes actualizar tus propias plantillas');
    }

    const changes: { field: string; change: string }[] = [];

    // Detectar cambios
    if (data.name && data.name !== template.name) {
      changes.push({ field: 'name', change: `Nombre cambiado de "${template.name}" a "${data.name}"` });
    }

    if (data.config) {
      // Comparar configuraciones y detectar cambios
      if (JSON.stringify(data.config.categories) !== JSON.stringify(template.categories)) {
        changes.push({ field: 'categories', change: data.changeNotes || 'Categorías actualizadas' });
      }
      if (JSON.stringify(data.config.modalities) !== JSON.stringify(template.modalities)) {
        changes.push({ field: 'modalities', change: 'Modalidades actualizadas' });
      }
      // ... más comparaciones si es necesario
    }

    // Actualizar plantilla
    if (data.name) template.name = data.name;
    if (data.description !== undefined) template.description = data.description;
    if (data.category) template.category = data.category;
    if (data.isPublic !== undefined) template.isPublic = data.isPublic;
    if (data.tags) template.tags = data.tags;
    if (data.config) {
      template.basicInfo = data.config.basicInfo || template.basicInfo;
      template.modalities = data.config.modalities || template.modalities;
      template.categories = data.config.categories || template.categories;
      template.competitionSystem = data.config.competitionSystem || template.competitionSystem;
      template.awards = data.config.awards || template.awards;
      template.seedingRules = data.config.seedingRules || template.seedingRules;
      template.registration = data.config.registration || template.registration;
      template.equipment = data.config.equipment || template.equipment;
    }

    // Incrementar versión
    template.version += 1;

    const updatedTemplate = await this.templateRepository.save(template);

    // Crear nueva versión con snapshot
    await this.createVersion(id, userId, changes, updatedTemplate, data.changeNotes);

    return updatedTemplate;
  }

  /**
   * Eliminar plantilla (soft delete)
   */
  async remove(id: string, organizationId: string): Promise<void> {
    const template = await this.findOne(id, organizationId);

    if (template.organizationId !== organizationId) {
      throw new ConflictException('Solo puedes eliminar tus propias plantillas');
    }

    template.isActive = false;
    await this.templateRepository.save(template);
  }

  /**
   * Crear nueva versión de plantilla
   */
  async createVersion(
    templateId: string,
    createdBy: string,
    changes: { field: string; change: string }[],
    template: ConfigurationTemplate,
    notes?: string,
  ): Promise<TemplateVersion> {
    const version = this.versionRepository.create({
      templateId,
      version: template.version,
      changes,
      snapshot: {
        basicInfo: template.basicInfo,
        modalities: template.modalities,
        categories: template.categories,
        competitionSystem: template.competitionSystem,
        awards: template.awards,
        seedingRules: template.seedingRules,
        registration: template.registration,
        equipment: template.equipment,
      },
      createdBy,
      notes,
    });

    return await this.versionRepository.save(version);
  }

  /**
   * Obtener todas las versiones de una plantilla
   */
  async getVersions(templateId: string, organizationId: string): Promise<TemplateVersion[]> {
    // Verificar que la plantilla existe y pertenece a la organización
    await this.findOne(templateId, organizationId);

    return await this.versionRepository.find({
      where: { templateId },
      order: { version: 'DESC' },
    });
  }

  /**
   * Obtener versión específica
   */
  async getVersion(
    templateId: string,
    version: number,
    organizationId: string,
  ): Promise<TemplateVersion> {
    await this.findOne(templateId, organizationId);

    const templateVersion = await this.versionRepository.findOne({
      where: { templateId, version },
    });

    if (!templateVersion) {
      throw new NotFoundException(`Versión ${version} no encontrada`);
    }

    return templateVersion;
  }

  /**
   * Comparar dos versiones
   */
  async compareVersions(
    templateId: string,
    version1: number,
    version2: number,
    organizationId: string,
  ): Promise<{
    version1: TemplateVersion;
    version2: TemplateVersion;
    differences: any;
  }> {
    const v1 = await this.getVersion(templateId, version1, organizationId);
    const v2 = await this.getVersion(templateId, version2, organizationId);

    // Comparar snapshots y detectar diferencias
    const differences: any = {};

    const fields = ['basicInfo', 'modalities', 'categories', 'competitionSystem', 'awards', 'seedingRules', 'registration', 'equipment'];

    for (const field of fields) {
      if (JSON.stringify(v1.snapshot[field]) !== JSON.stringify(v2.snapshot[field])) {
        differences[field] = {
          version1: v1.snapshot[field],
          version2: v2.snapshot[field],
        };
      }
    }

    return {
      version1: v1,
      version2: v2,
      differences,
    };
  }
}

