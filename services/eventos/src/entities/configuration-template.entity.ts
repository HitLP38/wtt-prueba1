import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum TemplateCategory {
  OFFICIAL = 'OFFICIAL', // Categorías oficiales
  SPECIAL = 'SPECIAL', // Categorías especiales (Hopes, Escolares)
  SCHOOL = 'SCHOOL', // Escolares
  UNIVERSITY = 'UNIVERSITY', // Universitaria
  CUSTOM = 'CUSTOM', // Personalizada
}

@Entity('configuration_templates')
@Index(['organizationId']) // Índice multi-tenant
@Index(['organizationId', 'isActive']) // Plantillas activas por org
@Index(['isPublic']) // Plantillas públicas
@Index(['category']) // Filtro por categoría
@Index(['tags']) // Búsqueda por tags (GIN index para arrays)
@Index(['name']) // Búsqueda por nombre
export class ConfigurationTemplate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  @Column({ nullable: true })
  eventId?: string; // FK a Event (si se creó desde un evento)

  @Column()
  name!: string; // Ej: "Torneo Topspin Cup 2025"

  @Column({ nullable: true, type: 'text' })
  description?: string; // Descripción de la plantilla

  @Column({ default: 1 })
  version!: number; // Versión actual de la plantilla

  @Column({ nullable: true })
  parentTemplateId?: string; // FK a ConfigurationTemplate (si es una versión)

  @Column({ default: false })
  isPublic!: boolean; // Si otros clubes pueden verla/usarla

  @Column({
    type: 'enum',
    enum: TemplateCategory,
    default: TemplateCategory.CUSTOM,
  })
  category!: TemplateCategory;

  // Datos de la configuración completa (JSONB para flexibilidad)
  @Column({ type: 'jsonb' })
  basicInfo!: Record<string, any>; // EventBasicInfo

  @Column({ type: 'jsonb' })
  modalities!: Record<string, any>[]; // Modality[]

  @Column({ type: 'jsonb' })
  categories!: Record<string, any>[]; // Category[]

  @Column({ type: 'jsonb' })
  competitionSystem!: Record<string, any>; // CompetitionSystem

  @Column({ type: 'jsonb' })
  awards!: Record<string, any>; // EventAwards

  @Column({ type: 'jsonb' })
  seedingRules!: Record<string, any>; // EventSeedingRules

  @Column({ type: 'jsonb' })
  registration!: Record<string, any>; // EventRegistration

  @Column({ type: 'jsonb' })
  equipment!: Record<string, any>; // EventEquipment

  // Metadatos
  @Column({ type: 'text', array: true, default: [] })
  tags!: string[]; // Tags para búsqueda (ej: ["oficial", "2025", "topspin"])

  @Column({ default: 0 })
  usageCount!: number; // Cuántas veces se ha usado

  @Column({ nullable: true })
  lastUsedAt?: Date; // Última vez que se usó

  @Column()
  createdBy!: string; // ID del usuario que creó la plantilla

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

