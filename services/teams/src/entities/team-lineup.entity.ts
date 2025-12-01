import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('team_lineups')
export class TeamLineup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teamId: string;

  @Column()
  matchId: string;

  @Column()
  s1PlayerId: string;

  @Column()
  s2PlayerId: string;

  @Column()
  dPlayer1Id: string;

  @Column()
  dPlayer2Id: string;

  @Column()
  s3PlayerId: string;

  @Column()
  s4PlayerId: string;

  @Column({ default: false })
  isValid: boolean;

  @Column('text', { array: true, nullable: true })
  validationErrors: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


