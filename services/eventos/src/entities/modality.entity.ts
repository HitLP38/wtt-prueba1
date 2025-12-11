import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('modalities')
@Index(['eventId']) // Modalidades por evento
@Index(['organizationId']) // Índice multi-tenant
@Index(['organizationId', 'eventId'], { unique: true }) // Una modalidad por tipo por evento
@Index(['type']) // Filtro por tipo
export class Modality {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventId!: string; // FK a Event

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  @Column({
    type: 'enum',
    enum: ['INDIVIDUAL', 'DOUBLES'],
  })
  type!: 'INDIVIDUAL' | 'DOUBLES';

  @Column({ default: true })
  isEnabled!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

