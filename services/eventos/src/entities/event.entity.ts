import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('events')
@Index(['startDate', 'endDate']) // Para consultas de eventos por rango de fechas
@Index(['isActive']) // Para filtrar eventos activos rápidamente
@Index(['organizationId']) // Índice crítico para multi-tenant
@Index(['organizationId', 'isActive']) // Búsqueda por org y estado
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  basesUrl: string;

  @Column({ nullable: true })
  venue: string; // Lugar del evento

  @Column({ nullable: true })
  address: string; // Dirección completa

  @Column({ nullable: true })
  registrationDeadline: Date; // Fecha límite de inscripción

  @Column({ nullable: true })
  drawDate: Date; // Fecha del sorteo

  @Column({ nullable: true, type: 'decimal' })
  prizeMoney: number; // Premio en efectivo

  @Column({ default: 0 })
  maxTables: number; // Número máximo de mesas disponibles

  @Column({ nullable: true, type: 'jsonb' })
  settings: Record<string, any>; // Configuraciones del evento

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


