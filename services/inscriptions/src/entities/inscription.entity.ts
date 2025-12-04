import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { InscriptionStatus } from '@wtt/common';

@Entity('inscriptions')
@Index(['eventId']) // Consultas por evento (muy frecuente)
@Index(['playerId']) // Consultas por jugador
@Index(['status']) // Filtrado por estado
@Index(['eventId', 'status']) // Consultas combinadas evento + estado
export class Inscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column()
  playerId: string;

  @Column()
  category: string;

  @Column()
  division: string; // 'masculino' | 'femenino' | 'mixto'

  @Column()
  club: string;

  @Column({ nullable: true })
  paymentReceiptUrl: string;

  @Column({
    type: 'enum',
    enum: InscriptionStatus,
    default: InscriptionStatus.PENDING,
  })
  status: InscriptionStatus;

  @Column({ nullable: true })
  validatedBy: string;

  @Column({ nullable: true })
  validatedAt: Date;

  @Column({ nullable: true, type: 'text' })
  rejectionReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


