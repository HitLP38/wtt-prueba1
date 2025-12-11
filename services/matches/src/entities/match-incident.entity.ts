import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('match_incidents')
@Index(['matchId']) // Incidentes por partido
@Index(['type']) // Filtrar por tipo
export class MatchIncident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column({
    type: 'enum',
    enum: ['yellow_card', 'red_card', 'timeout', 'side_change', 'other'],
  })
  type: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column()
  timestamp: Date;

  @Column({ nullable: true })
  refereeId: string; // Árbitro que registró la incidencia

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

