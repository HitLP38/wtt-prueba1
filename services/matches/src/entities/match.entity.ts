import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { MatchStatus, MatchType, MatchCallStatus } from '@wtt/common';

@Entity('matches')
@Index(['eventId']) // Consultas por evento
@Index(['status']) // Filtrado por estado (muy frecuente en WebSockets)
@Index(['tableNumber']) // Búsqueda por mesa
@Index(['eventId', 'status']) // Consultas combinadas evento + estado
@Index(['round']) // Consultas por ronda
@Index(['refereeId']) // Consultas por árbitro
@Index(['organizationId']) // Índice crítico para multi-tenant
@Index(['organizationId', 'eventId']) // Búsqueda por org y evento
@Index(['organizationId', 'status']) // Búsqueda por org y estado
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  @Column({
    type: 'enum',
    enum: MatchType,
  })
  matchType: MatchType;

  @Column({ nullable: true })
  tableNumber: number;

  @Column()
  round: string;

  @Column({ nullable: true })
  player1Id: string;

  @Column({ nullable: true })
  player2Id: string;

  @Column({ nullable: true })
  team1Id: string;

  @Column({ nullable: true })
  team2Id: string;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  status: MatchStatus;

  @Column({ nullable: true })
  refereeId: string;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  categoryId: string; // Relación con EventCategory

  @Column({ nullable: true })
  scheduledTime: Date; // Horario programado

  @Column({ nullable: true })
  estimatedDuration: number; // Duración estimada en minutos

  @Column({ nullable: true })
  actualDuration: number; // Duración real en minutos

  @Column({
    type: 'enum',
    enum: MatchCallStatus,
    default: MatchCallStatus.NONE,
  })
  callStatus: MatchCallStatus; // Estado de llamados

  @Column({ nullable: true, type: 'jsonb' })
  metadata: Record<string, any>; // Datos adicionales (formato ITTF, etc.)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


