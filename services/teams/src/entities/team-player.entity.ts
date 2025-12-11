import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('team_players')
@Index(['teamId']) // Jugadores por equipo
@Index(['playerId']) // Equipos de un jugador
@Index(['teamId', 'playerId'], { unique: true }) // Evitar duplicados
export class TeamPlayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teamId: string;

  @Column()
  playerId: string;

  @Column()
  condition: string; // 'alumno', 'egresado', 'FDPTM', 'externo', 'otros'

  @Column({ default: false })
  isReserve: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

