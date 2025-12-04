import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { MatchStatus, MatchType } from '@wtt/common';

@Entity('matches')
@Index(['eventId']) // Consultas por evento
@Index(['status']) // Filtrado por estado (muy frecuente en WebSockets)
@Index(['tableNumber']) // Búsqueda por mesa
@Index(['eventId', 'status']) // Consultas combinadas evento + estado
@Index(['round']) // Consultas por ronda
@Index(['refereeId']) // Consultas por árbitro
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


