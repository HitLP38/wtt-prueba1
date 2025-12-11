import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventBasicInfo } from '../entities/event-basic-info.entity';
import { EventAwards } from '../entities/event-awards.entity';
import { EventEquipment } from '../entities/event-equipment.entity';
import { EventRegistration } from '../entities/event-registration.entity';
import { EventSeedingRules } from '../entities/event-seeding-rules.entity';
import { CompetitionSystem } from '../entities/competition-system.entity';

@Injectable()
export class EventConfigService {
  constructor(
    @InjectRepository(EventBasicInfo)
    private basicInfoRepository: Repository<EventBasicInfo>,
    @InjectRepository(EventAwards)
    private awardsRepository: Repository<EventAwards>,
    @InjectRepository(EventEquipment)
    private equipmentRepository: Repository<EventEquipment>,
    @InjectRepository(EventRegistration)
    private registrationRepository: Repository<EventRegistration>,
    @InjectRepository(EventSeedingRules)
    private seedingRulesRepository: Repository<EventSeedingRules>,
    @InjectRepository(CompetitionSystem)
    private competitionSystemRepository: Repository<CompetitionSystem>,
  ) {}

  // =====================================================
  // INFORMACIÓN BÁSICA
  // =====================================================

  async getBasicInfo(eventId: string, organizationId: string): Promise<EventBasicInfo | null> {
    return await this.basicInfoRepository.findOne({
      where: { eventId, organizationId },
    });
  }

  async upsertBasicInfo(
    eventId: string,
    organizationId: string,
    data: Partial<EventBasicInfo>,
  ): Promise<EventBasicInfo> {
    const existing = await this.getBasicInfo(eventId, organizationId);

    if (existing) {
      Object.assign(existing, { ...data, eventId, organizationId });
      return await this.basicInfoRepository.save(existing);
    }

    const basicInfo = this.basicInfoRepository.create({
      ...data,
      eventId,
      organizationId,
    });
    return await this.basicInfoRepository.save(basicInfo);
  }

  // =====================================================
  // PREMIOS
  // =====================================================

  async getAwards(eventId: string, organizationId: string): Promise<EventAwards | null> {
    return await this.awardsRepository.findOne({
      where: { eventId, organizationId },
    });
  }

  async upsertAwards(
    eventId: string,
    organizationId: string,
    data: Partial<EventAwards>,
  ): Promise<EventAwards> {
    const existing = await this.getAwards(eventId, organizationId);

    if (existing) {
      Object.assign(existing, { ...data, eventId, organizationId });
      return await this.awardsRepository.save(existing);
    }

    const awards = this.awardsRepository.create({
      ...data,
      eventId,
      organizationId,
    });
    return await this.awardsRepository.save(awards);
  }

  // =====================================================
  // EQUIPAMIENTO
  // =====================================================

  async getEquipment(
    eventId: string,
    organizationId: string,
  ): Promise<EventEquipment | null> {
    return await this.equipmentRepository.findOne({
      where: { eventId, organizationId },
    });
  }

  async upsertEquipment(
    eventId: string,
    organizationId: string,
    data: Partial<EventEquipment>,
  ): Promise<EventEquipment> {
    const existing = await this.getEquipment(eventId, organizationId);

    if (existing) {
      Object.assign(existing, { ...data, eventId, organizationId });
      return await this.equipmentRepository.save(existing);
    }

    const equipment = this.equipmentRepository.create({
      ...data,
      eventId,
      organizationId,
    });
    return await this.equipmentRepository.save(equipment);
  }

  // =====================================================
  // INSCRIPCIONES
  // =====================================================

  async getRegistration(
    eventId: string,
    organizationId: string,
  ): Promise<EventRegistration | null> {
    return await this.registrationRepository.findOne({
      where: { eventId, organizationId },
    });
  }

  async upsertRegistration(
    eventId: string,
    organizationId: string,
    data: Partial<EventRegistration>,
  ): Promise<EventRegistration> {
    const existing = await this.getRegistration(eventId, organizationId);

    if (existing) {
      Object.assign(existing, { ...data, eventId, organizationId });
      return await this.registrationRepository.save(existing);
    }

    const registration = this.registrationRepository.create({
      ...data,
      eventId,
      organizationId,
    });
    return await this.registrationRepository.save(registration);
  }

  // =====================================================
  // REGLAS DE SIEMBRA
  // =====================================================

  async getSeedingRules(
    eventId: string,
    organizationId: string,
  ): Promise<EventSeedingRules | null> {
    return await this.seedingRulesRepository.findOne({
      where: { eventId, organizationId },
    });
  }

  async upsertSeedingRules(
    eventId: string,
    organizationId: string,
    data: Partial<EventSeedingRules>,
  ): Promise<EventSeedingRules> {
    const existing = await this.getSeedingRules(eventId, organizationId);

    if (existing) {
      Object.assign(existing, { ...data, eventId, organizationId });
      return await this.seedingRulesRepository.save(existing);
    }

    const seedingRules = this.seedingRulesRepository.create({
      ...data,
      eventId,
      organizationId,
    });
    return await this.seedingRulesRepository.save(seedingRules);
  }

  // =====================================================
  // SISTEMA DE COMPETENCIA
  // =====================================================

  async getCompetitionSystem(
    eventId: string,
    organizationId: string,
  ): Promise<CompetitionSystem | null> {
    return await this.competitionSystemRepository.findOne({
      where: { eventId, organizationId },
    });
  }

  async upsertCompetitionSystem(
    eventId: string,
    organizationId: string,
    data: Partial<CompetitionSystem>,
  ): Promise<CompetitionSystem> {
    const existing = await this.getCompetitionSystem(eventId, organizationId);

    if (existing) {
      Object.assign(existing, { ...data, eventId, organizationId });
      return await this.competitionSystemRepository.save(existing);
    }

    const competitionSystem = this.competitionSystemRepository.create({
      ...data,
      eventId,
      organizationId,
    });
    return await this.competitionSystemRepository.save(competitionSystem);
  }

  // =====================================================
  // OBTENER CONFIGURACIÓN COMPLETA
  // =====================================================

  async getCompleteConfig(eventId: string, organizationId: string) {
    const [
      basicInfo,
      awards,
      equipment,
      registration,
      seedingRules,
      competitionSystem,
    ] = await Promise.all([
      this.getBasicInfo(eventId, organizationId),
      this.getAwards(eventId, organizationId),
      this.getEquipment(eventId, organizationId),
      this.getRegistration(eventId, organizationId),
      this.getSeedingRules(eventId, organizationId),
      this.getCompetitionSystem(eventId, organizationId),
    ]);

    return {
      basicInfo: basicInfo || null,
      awards: awards || null,
      equipment: equipment || null,
      registration: registration || null,
      seedingRules: seedingRules || null,
      competitionSystem: competitionSystem || null,
    };
  }

  // =====================================================
  // GUARDAR CONFIGURACIÓN COMPLETA
  // =====================================================

  async saveCompleteConfig(
    eventId: string,
    organizationId: string,
    config: {
      basicInfo?: Partial<EventBasicInfo>;
      awards?: Partial<EventAwards>;
      equipment?: Partial<EventEquipment>;
      registration?: Partial<EventRegistration>;
      seedingRules?: Partial<EventSeedingRules>;
      competitionSystem?: Partial<CompetitionSystem>;
    },
  ) {
    const promises: Promise<any>[] = [];

    if (config.basicInfo) {
      promises.push(this.upsertBasicInfo(eventId, organizationId, config.basicInfo));
    }

    if (config.awards) {
      promises.push(this.upsertAwards(eventId, organizationId, config.awards));
    }

    if (config.equipment) {
      promises.push(this.upsertEquipment(eventId, organizationId, config.equipment));
    }

    if (config.registration) {
      promises.push(this.upsertRegistration(eventId, organizationId, config.registration));
    }

    if (config.seedingRules) {
      promises.push(this.upsertSeedingRules(eventId, organizationId, config.seedingRules));
    }

    if (config.competitionSystem) {
      promises.push(
        this.upsertCompetitionSystem(eventId, organizationId, config.competitionSystem),
      );
    }

    await Promise.all(promises);

    return this.getCompleteConfig(eventId, organizationId);
  }
}

