import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum RoundType {
  ROUND_ROBIN = 'ROUND_ROBIN', // Todos contra todos
  KNOCKOUT = 'KNOCKOUT', // Eliminación directa
  MIXED = 'MIXED', // Clasificatoria + Eliminación (como en las imágenes)
}

@Entity('competition_systems')
@Index(['eventId'], { unique: true }) // Un sistema de competencia por evento
@Index(['organizationId']) // Índice multi-tenant
export class CompetitionSystem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventId!: string; // FK a Event (UNIQUE)

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  // Sistema de sets
  @Column({ default: 5 })
  defaultSets!: number; // Sets por defecto (ej: 5 - mejor de 5)

  @Column({ default: 7 })
  finalSets!: number; // Sets para finales (ej: 7 - mejor de 7)

  @Column({ default: false })
  allowCategoryExceptions!: boolean; // Permitir excepciones por categoría

  // Excepciones por categoría (ej: Hopes y Escolares = 3 sets)
  @Column({ type: 'jsonb', nullable: true })
  categorySetOverrides?: {
    categoryId: string;
    sets: number;
    finalSets?: number;
  }[];

  // Tipo de ronda
  @Column({
    type: 'enum',
    enum: RoundType,
    default: RoundType.MIXED,
  })
  roundType!: RoundType;

  // Tiempos
  @Column({ default: 5 })
  warmupTimeMinutes!: number; // Tiempo de calentamiento

  @Column({ default: 1 })
  breakBetweenSetsMinutes!: number; // Descanso entre sets

  @Column({ default: 30 })
  matchDurationEstimate!: number; // Duración estimada por partido (minutos)

  // Configuración de rondas
  @Column({ type: 'jsonb', nullable: true })
  roundConfiguration?: {
    qualifyingGroups?: {
      minPlayers: number;
      maxPlayers: number;
    };
    finalRounds?: {
      type: 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION';
      format: string;
    };
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

