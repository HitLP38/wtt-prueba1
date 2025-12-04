import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('teams')
@Index(['eventId']) // Consultas por evento (muy frecuente)
@Index(['coachId']) // Consultas por coach
@Index(['eventId', 'coachId']) // Consultas combinadas
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  coachId: string;

  @Column()
  eventId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


