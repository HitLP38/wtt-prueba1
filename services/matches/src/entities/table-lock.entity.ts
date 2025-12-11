import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('table_locks')
@Index(['tableId']) // Bloqueos por mesa
@Index(['refereeId']) // Mesas bloqueadas por árbitro
@Index(['eventId']) // Bloqueos por evento
@Index(['isActive']) // Solo bloqueos activos
export class TableLock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column()
  tableId: string;

  @Column()
  refereeId: string; // Árbitro que bloqueó la mesa

  @Column({ default: true })
  isActive: boolean; // Si el bloqueo está activo

  @Column()
  lockedAt: Date; // Fecha/hora del bloqueo

  @Column({ nullable: true })
  unlockedAt: Date; // Fecha/hora de desbloqueo

  @Column({ nullable: true, type: 'text' })
  reason: string; // Razón del bloqueo

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

