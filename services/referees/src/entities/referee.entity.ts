import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('referees')
@Index(['clerkId']) // Login con Clerk
@Index(['isActive']) // Árbitros activos
@Index(['organizationId']) // Índice crítico para multi-tenant
@Index(['organizationId', 'isActive']) // Búsqueda por org y estado
export class Referee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  @Column({ unique: true })
  clerkId!: string; // ID de Clerk para autenticación

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  licenseNumber?: string; // Licencia ITTF

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: 0 })
  matchesAssigned!: number; // Contador para distribución

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

