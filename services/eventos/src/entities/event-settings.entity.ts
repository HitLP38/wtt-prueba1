import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('event_settings')
@Index(['eventId'], { unique: true }) // Una configuración por evento
export class EventSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column({ default: 5 })
  defaultSetsToWin: number; // Al mejor de 5 (default)

  @Column({ default: 7 })
  finalSetsToWin: number; // Final al mejor de 7

  @Column({ type: 'jsonb', nullable: true })
  categorySettings: Record<string, {
    setsToWin: number;
    finalSetsToWin: number;
    exceptions?: string[];
  }>; // Excepciones por categoría

  @Column({ default: true })
  allowTableUnfolding: boolean; // Permitir desdoblamiento

  @Column({ default: 30 })
  matchDurationEstimate: number; // Duración estimada en minutos

  @Column({ default: 15 })
  tableChangeTime: number; // Tiempo entre partidos en la misma mesa

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

