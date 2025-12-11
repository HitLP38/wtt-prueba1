import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('sets')
@Index(['matchId']) // Sets por partido
@Index(['matchId', 'setNumber'], { unique: true }) // Un set por número en cada partido
export class Set {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column()
  setNumber: number; // 1, 2, 3, 4, 5, 6, 7

  @Column({ default: 0 })
  player1Score: number; // Score del jugador/equipo 1

  @Column({ default: 0 })
  player2Score: number; // Score del jugador/equipo 2

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

