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
@Index(['organizationId']) // Índice crítico para multi-tenant
@Index(['organizationId', 'eventId']) // Búsqueda por org y evento
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  @Column()
  name: string;

  @Column()
  coachId: string;

  @Column()
  eventId: string;

  @Column({ nullable: true })
  categoryId: string; // Categoría del equipo

  @Column({ nullable: true })
  coachWhatsApp: string; // WhatsApp del entrenador para notificaciones

  @Column({ default: 0 })
  membersCount: number; // Número de integrantes (calculado)

  @Column({ nullable: true, type: 'text' })
  notes: string; // Notas adicionales del equipo

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


