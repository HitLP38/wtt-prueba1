import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('event_seeding_rules')
@Index(['eventId'], { unique: true }) // Una configuración de siembra por evento
@Index(['organizationId']) // Índice multi-tenant
export class EventSeedingRules {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventId!: string; // FK a Event (UNIQUE)

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  // Consideraciones de siembra
  @Column({ default: false })
  useInternationalRanking!: boolean; // Ranking Internacional ITTF

  @Column({ default: false })
  useNationalRanking!: boolean; // Ranking Nacional - Última Publicación

  @Column({ nullable: true })
  rankingSource?: string; // URL o referencia del ranking

  @Column({ nullable: true, type: 'text' })
  observations?: string; // Observaciones/normativas del sistema

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

