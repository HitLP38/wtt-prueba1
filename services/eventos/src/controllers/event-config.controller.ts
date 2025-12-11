import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from '../services/category.service';
import { ModalityService } from '../services/modality.service';
import { EventConfigService } from '../services/event-config.service';

@Controller()
export class EventConfigController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly modalityService: ModalityService,
    private readonly eventConfigService: EventConfigService,
  ) {}

  // =====================================================
  // CATEGORÍAS
  // =====================================================

  @MessagePattern('create_category')
  async createCategory(@Payload() data: any) {
    return this.categoryService.create(data);
  }

  @MessagePattern('get_categories')
  async getCategories(@Payload() data: { eventId: string; organizationId: string }) {
    return this.categoryService.findByEvent(data.eventId, data.organizationId);
  }

  @MessagePattern('get_categories_by_filters')
  async getCategoriesByFilters(
    @Payload() data: {
      eventId: string;
      organizationId: string;
      modality?: string;
      gender?: string;
    },
  ) {
    return this.categoryService.findByModalityAndGender(
      data.eventId,
      data.organizationId,
      data.modality || 'INDIVIDUAL',
      data.gender,
    );
  }

  @MessagePattern('get_category')
  async getCategory(@Payload() data: { id: string; organizationId: string }) {
    return this.categoryService.findOne(data.id, data.organizationId);
  }

  @MessagePattern('update_category')
  async updateCategory(@Payload() data: { id: string; organizationId: string; data: any }) {
    return this.categoryService.update(data.id, data.organizationId, data.data);
  }

  @MessagePattern('delete_category')
  async deleteCategory(@Payload() data: { id: string; organizationId: string }) {
    await this.categoryService.remove(data.id, data.organizationId);
    return { success: true };
  }

  // =====================================================
  // MODALIDADES
  // =====================================================

  @MessagePattern('upsert_modality')
  async upsertModality(@Payload() data: any) {
    return this.modalityService.upsert(data);
  }

  @MessagePattern('get_modalities')
  async getModalities(@Payload() data: { eventId: string; organizationId: string }) {
    return this.modalityService.findByEvent(data.eventId, data.organizationId);
  }

  @MessagePattern('toggle_modality')
  async toggleModality(
    @Payload() data: { eventId: string; organizationId: string; type: string },
  ) {
    return this.modalityService.toggle(data.eventId, data.organizationId, data.type);
  }

  // =====================================================
  // CONFIGURACIÓN COMPLETA
  // =====================================================

  @MessagePattern('get_event_config')
  async getEventConfig(@Payload() data: { eventId: string; organizationId: string }) {
    return this.eventConfigService.getCompleteConfig(data.eventId, data.organizationId);
  }

  @MessagePattern('save_event_config')
  async saveEventConfig(@Payload() data: { eventId: string; organizationId: string; config: any }) {
    return this.eventConfigService.saveCompleteConfig(
      data.eventId,
      data.organizationId,
      data.config,
    );
  }

  // =====================================================
  // INFORMACIÓN BÁSICA
  // =====================================================

  @MessagePattern('get_basic_info')
  async getBasicInfo(@Payload() data: { eventId: string; organizationId: string }) {
    return this.eventConfigService.getBasicInfo(data.eventId, data.organizationId);
  }

  @MessagePattern('save_basic_info')
  async saveBasicInfo(@Payload() data: { eventId: string; organizationId: string; data: any }) {
    return this.eventConfigService.upsertBasicInfo(
      data.eventId,
      data.organizationId,
      data.data,
    );
  }

  // =====================================================
  // PREMIOS
  // =====================================================

  @MessagePattern('get_awards')
  async getAwards(@Payload() data: { eventId: string; organizationId: string }) {
    return this.eventConfigService.getAwards(data.eventId, data.organizationId);
  }

  @MessagePattern('save_awards')
  async saveAwards(@Payload() data: { eventId: string; organizationId: string; data: any }) {
    return this.eventConfigService.upsertAwards(data.eventId, data.organizationId, data.data);
  }

  // =====================================================
  // EQUIPAMIENTO
  // =====================================================

  @MessagePattern('get_equipment')
  async getEquipment(@Payload() data: { eventId: string; organizationId: string }) {
    return this.eventConfigService.getEquipment(data.eventId, data.organizationId);
  }

  @MessagePattern('save_equipment')
  async saveEquipment(@Payload() data: { eventId: string; organizationId: string; data: any }) {
    return this.eventConfigService.upsertEquipment(data.eventId, data.organizationId, data.data);
  }

  // =====================================================
  // INSCRIPCIONES
  // =====================================================

  @MessagePattern('get_registration')
  async getRegistration(@Payload() data: { eventId: string; organizationId: string }) {
    return this.eventConfigService.getRegistration(data.eventId, data.organizationId);
  }

  @MessagePattern('save_registration')
  async saveRegistration(@Payload() data: { eventId: string; organizationId: string; data: any }) {
    return this.eventConfigService.upsertRegistration(
      data.eventId,
      data.organizationId,
      data.data,
    );
  }

  // =====================================================
  // REGLAS DE SIEMBRA
  // =====================================================

  @MessagePattern('get_seeding_rules')
  async getSeedingRules(@Payload() data: { eventId: string; organizationId: string }) {
    return this.eventConfigService.getSeedingRules(data.eventId, data.organizationId);
  }

  @MessagePattern('save_seeding_rules')
  async saveSeedingRules(@Payload() data: { eventId: string; organizationId: string; data: any }) {
    return this.eventConfigService.upsertSeedingRules(
      data.eventId,
      data.organizationId,
      data.data,
    );
  }

  // =====================================================
  // SISTEMA DE COMPETENCIA
  // =====================================================

  @MessagePattern('get_competition_system')
  async getCompetitionSystem(@Payload() data: { eventId: string; organizationId: string }) {
    return this.eventConfigService.getCompetitionSystem(data.eventId, data.organizationId);
  }

  @MessagePattern('save_competition_system')
  async saveCompetitionSystem(@Payload() data: { eventId: string; organizationId: string; data: any }) {
    return this.eventConfigService.upsertCompetitionSystem(
      data.eventId,
      data.organizationId,
      data.data,
    );
  }
}

