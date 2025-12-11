import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ProspectStatus {
  PENDING = 'PENDING', // Generándose
  COMPLETED = 'COMPLETED', // Generado exitosamente
  FAILED = 'FAILED', // Error en generación
}

@Entity('event_prospects')
@Index(['eventId']) // Prospectos por evento
@Index(['organizationId']) // Índice multi-tenant
@Index(['organizationId', 'eventId']) // Búsqueda por org y evento
@Index(['status']) // Filtrado por estado
@Index(['version']) // Versiones del prospecto
export class EventProspect {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventId!: string; // FK a Event

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  @Column({ default: 1 })
  version!: number; // Versión del prospecto (si se regenera)

  @Column({
    type: 'enum',
    enum: ProspectStatus,
    default: ProspectStatus.PENDING,
  })
  status!: ProspectStatus;

  @Column({ nullable: true })
  fileUrl?: string; // URL del PDF generado (S3, local, etc.)

  @Column({ nullable: true })
  filePath?: string; // Ruta del archivo (si se almacena localmente)

  @Column({ nullable: true })
  fileName?: string; // Nombre del archivo (ej: "prospecto-topspin-cup-2025.pdf")

  @Column({ nullable: true, type: 'bigint' })
  fileSize?: number; // Tamaño del archivo en bytes

  @Column({ nullable: true })
  generatedBy?: string; // ID del usuario que generó el prospecto

  @Column({ nullable: true })
  generatedAt?: Date; // Fecha de generación

  @Column({ nullable: true, type: 'text' })
  errorMessage?: string; // Mensaje de error si falló

  // Configuración usada para generar este prospecto (snapshot)
  @Column({ type: 'jsonb', nullable: true })
  configSnapshot?: Record<string, any>; // Configuración completa en el momento de generación

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

