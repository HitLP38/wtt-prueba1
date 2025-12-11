import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('event_referees')
@Index(['eventId']) // Árbitros por evento
@Index(['refereeId']) // Eventos por árbitro
@Index(['eventId', 'refereeId'], { unique: true }) // Un permiso único
export class EventReferee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column()
  refereeId: string;

  @Column({ default: true })
  isEnabled: boolean; // Habilitado para este evento

  @Column({ nullable: true })
  enabledBy: string; // ID del admin que habilitó

  @Column({ nullable: true })
  enabledAt: Date;

  @Column({ nullable: true })
  disabledAt: Date;

  @Column({ nullable: true, type: 'text' })
  notes: string; // Notas del administrador

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

