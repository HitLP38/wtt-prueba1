import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('event_basic_info')
@Index(['eventId'], { unique: true }) // Una configuración por evento
@Index(['organizationId']) // Índice multi-tenant
export class EventBasicInfo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventId!: string; // FK a Event (UNIQUE)

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  @Column()
  eventName!: string; // Nombre del evento

  @Column()
  organizationName!: string; // Razón social

  @Column({ nullable: true })
  organizationRUC?: string; // RUC de la organización

  @Column({ nullable: true })
  organizationWhatsApp?: string;

  @Column({ nullable: true })
  organizationPhone?: string;

  // Comisión de organización (JSONB para flexibilidad)
  @Column({ type: 'jsonb', nullable: true })
  competitionManager?: {
    name: string;
    contact: string; // Teléfono
    email: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  generalJudge?: {
    name: string;
    contact: string; // Teléfono
    email: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  competitionVenue?: {
    name: string; // Nombre del lugar (ej: "Coliseo Colegio Champagnat")
    contact: string;
    email: string;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

