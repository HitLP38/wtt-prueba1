import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { NotificationType, NotificationStatus } from '@wtt/common';

@Entity('notifications')
@Index(['playerId']) // Notificaciones por jugador
@Index(['teamId']) // Notificaciones por equipo
@Index(['type']) // Filtrar por tipo
@Index(['status']) // Filtrar por estado
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type!: NotificationType;

  @Column({ nullable: true })
  playerId?: string; // Si es notificación individual

  @Column({ nullable: true })
  teamId?: string; // Si es notificación de equipo

  @Column({ nullable: true })
  matchId?: string; // Partido relacionado

  @Column()
  phone!: string; // Número de WhatsApp destino

  @Column('text')
  message!: string; // Mensaje a enviar

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status!: NotificationStatus;

  @Column({ nullable: true })
  sentAt?: Date;

  @Column({ nullable: true, type: 'text' })
  errorMessage?: string; // Error si falla el envío

  @Column({ nullable: true })
  retryCount?: number; // Número de intentos

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

