import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { TableStatus } from '@wtt/common';

@Entity('tables')
@Index(['eventId']) // Mesas por evento
@Index(['isActive']) // Mesas disponibles
@Index(['eventId', 'isActive']) // Consultas combinadas
@Index(['status']) // Filtrado por estado
@Index(['organizationId']) // Índice crítico para multi-tenant
@Index(['organizationId', 'eventId']) // Búsqueda por org y evento
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  @Column()
  tableNumber: number; // Número de mesa (1, 2, 3, ...)

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  location: string; // "Sala A", "Sala B", etc.

  @Column({ nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: TableStatus,
    default: TableStatus.AVAILABLE,
  })
  status: TableStatus;

  @Column({ nullable: true })
  currentMatchId: string; // Partido actual

  @Column({ nullable: true })
  lockedByRefereeId: string; // Árbitro que tiene la mesa bloqueada

  @Column({ nullable: true })
  lastMatchCompletedAt: Date; // Última vez que terminó un partido

  @Column({ nullable: true })
  progressPercentage: number; // Progreso de la serie (0-100)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

