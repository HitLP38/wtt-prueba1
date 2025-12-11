import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('match_assignments')
@Index(['matchId'], { unique: true }) // Un partido solo puede estar asignado una vez
@Index(['tableId']) // Partidos por mesa
@Index(['refereeId']) // Partidos por árbitro
@Index(['scheduledTime']) // Orden por horario
export class MatchAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column()
  tableId: string;

  @Column()
  refereeId: string;

  @Column()
  scheduledTime: Date; // Horario programado

  @Column({ nullable: true })
  actualStartTime: Date; // Horario real de inicio

  @Column({ nullable: true })
  priority: number; // Prioridad (1 = más alta)

  @Column({ default: false })
  isConfirmed: boolean; // Confirmado por árbitro

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

