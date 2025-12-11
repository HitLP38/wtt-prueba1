import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum Gender {
  MALE = 'MALE', // Varones
  FEMALE = 'FEMALE', // Damas
  MIXED = 'MIXED', // Mixto
  ALL = 'ALL', // Sin restricción
}

export enum ModalityType {
  INDIVIDUAL = 'INDIVIDUAL',
  DOUBLES = 'DOUBLES',
  TEAM = 'TEAM',
}

export enum Currency {
  PEN = 'PEN', // Soles
  USD = 'USD', // Dólares
}

@Entity('categories')
@Index(['eventId']) // Categorías por evento
@Index(['organizationId']) // Índice multi-tenant
@Index(['organizationId', 'eventId']) // Búsqueda por org y evento
@Index(['modality', 'gender']) // Filtros frecuentes
@Index(['isActive']) // Solo activas
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventId!: string; // FK a Event

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  @Column()
  name!: string; // Ej: "IV19", "IIIA", "Hopes", "Escolar", etc.

  @Column()
  eventCode!: string; // Ej: "IV07", "ID07", "HOPV06", "ESCV12", "DVoo", etc.

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.ALL,
  })
  gender!: Gender;

  @Column({
    type: 'enum',
    enum: ModalityType,
    default: ModalityType.INDIVIDUAL,
  })
  modality!: ModalityType;

  @Column({ type: 'jsonb', nullable: true })
  ageRange?: {
    min?: number; // Edad mínima (null si no aplica)
    max?: number; // Edad máxima (null si no aplica)
    rule?: string; // Regla personalizada (ej: "Hasta 7 años", "Desde 30 años")
  };

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost!: number; // Costo de inscripción

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  additionalCost?: number; // Costo adicional (si aplica)

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.PEN,
  })
  currency!: Currency;

  @Column({ nullable: true, type: 'text' })
  ageRule?: string; // Regla de edad personalizada (ej: "Hasta 7 años", "Estudiantes Universitarios")

  @Column({ nullable: true })
  maxParticipants?: number; // Límite de participantes

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  hasNationalRanking!: boolean; // Si requiere ranking nacional

  @Column({ nullable: true })
  categoryType?: string; // 'OFFICIAL' | 'SPECIAL' | 'SCHOOL' | 'UNIVERSITY' | 'FREE'

  @Column({ nullable: true, type: 'text' })
  notes?: string; // Notas adicionales de la categoría

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

