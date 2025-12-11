import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventConfigService {
  constructor(
    @Inject('EVENTOS_SERVICE') private eventosClient: ClientProxy,
  ) {}

  // =====================================================
  // CONFIGURACIÓN COMPLETA
  // =====================================================

  async getCompleteConfig(eventId: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_event_config', { eventId, organizationId }),
    );
  }

  async saveCompleteConfig(eventId: string, organizationId: string, config: any) {
    return firstValueFrom(
      this.eventosClient.send('save_event_config', { eventId, organizationId, config }),
    );
  }

  // =====================================================
  // INFORMACIÓN BÁSICA
  // =====================================================

  async getBasicInfo(eventId: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_basic_info', { eventId, organizationId }),
    );
  }

  async saveBasicInfo(eventId: string, organizationId: string, data: any) {
    return firstValueFrom(
      this.eventosClient.send('save_basic_info', { eventId, organizationId, data }),
    );
  }

  // =====================================================
  // MODALIDADES Y CATEGORÍAS
  // =====================================================

  async getModalities(eventId: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_modalities', { eventId, organizationId }),
    );
  }

  async upsertModality(data: any) {
    return firstValueFrom(this.eventosClient.send('upsert_modality', data));
  }

  async getCategories(eventId: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_categories', { eventId, organizationId }),
    );
  }

  async getCategoriesByFilters(
    eventId: string,
    organizationId: string,
    modality?: string,
    gender?: string,
  ) {
    // Enviar al microservicio con filtros
    return firstValueFrom(
      this.eventosClient.send('get_categories_by_filters', {
        eventId,
        organizationId,
        modality,
        gender,
      }),
    );
  }

  async createCategory(data: any) {
    return firstValueFrom(this.eventosClient.send('create_category', data));
  }

  async updateCategory(categoryId: string, organizationId: string, data: any) {
    return firstValueFrom(
      this.eventosClient.send('update_category', { id: categoryId, organizationId, data }),
    );
  }

  async deleteCategory(categoryId: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('delete_category', { id: categoryId, organizationId }),
    );
  }

  // =====================================================
  // SISTEMA DE COMPETENCIA
  // =====================================================

  async getCompetitionSystem(eventId: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_competition_system', { eventId, organizationId }),
    );
  }

  async saveCompetitionSystem(eventId: string, organizationId: string, data: any) {
    return firstValueFrom(
      this.eventosClient.send('save_competition_system', { eventId, organizationId, data }),
    );
  }

  // =====================================================
  // PREMIOS
  // =====================================================

  async getAwards(eventId: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_awards', { eventId, organizationId }),
    );
  }

  async saveAwards(eventId: string, organizationId: string, data: any) {
    return firstValueFrom(
      this.eventosClient.send('save_awards', { eventId, organizationId, data }),
    );
  }

  // =====================================================
  // REGLAS DE SIEMBRA
  // =====================================================

  async getSeedingRules(eventId: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_seeding_rules', { eventId, organizationId }),
    );
  }

  async saveSeedingRules(eventId: string, organizationId: string, data: any) {
    return firstValueFrom(
      this.eventosClient.send('save_seeding_rules', { eventId, organizationId, data }),
    );
  }

  // =====================================================
  // INSCRIPCIONES
  // =====================================================

  async getRegistration(eventId: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_registration', { eventId, organizationId }),
    );
  }

  async saveRegistration(eventId: string, organizationId: string, data: any) {
    return firstValueFrom(
      this.eventosClient.send('save_registration', { eventId, organizationId, data }),
    );
  }

  // =====================================================
  // EQUIPAMIENTO
  // =====================================================

  async getEquipment(eventId: string, organizationId: string) {
    return firstValueFrom(
      this.eventosClient.send('get_equipment', { eventId, organizationId }),
    );
  }

  async saveEquipment(eventId: string, organizationId: string, data: any) {
    return firstValueFrom(
      this.eventosClient.send('save_equipment', { eventId, organizationId, data }),
    );
  }
}

