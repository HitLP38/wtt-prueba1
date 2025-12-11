import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('organizations')
@Index(['slug'], { unique: true }) // Slug único para URLs
@Index(['organizationCode'], { unique: true }) // Código único para identificación
@Index(['clerkOrgId'], { unique: true }) // ID de Clerk único
@Index(['isActive']) // Para filtrar organizaciones activas
@Index(['subscriptionStatus']) // Para filtrar por estado de suscripción
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string; // Ej: "Club Real de Lima", "Topspin Sports SAC"

  @Column({ unique: true })
  slug!: string; // Ej: "club-real-lima", "topspin-sports"

  @Column({ unique: true })
  organizationCode!: string; // Ej: "CRL-2025-ABC123" - Identificador único

  @Column({
    type: 'enum',
    enum: ['CLUB', 'FEDERATION', 'ASSOCIATION'],
    default: 'CLUB',
  })
  organizationType!: 'CLUB' | 'FEDERATION' | 'ASSOCIATION';

  @Column({ nullable: true })
  ruc?: string; // RUC del club/organización

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  whatsapp?: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ nullable: true })
  bannerUrl?: string;

  @Column({
    type: 'enum',
    enum: ['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'],
    default: 'FREE',
  })
  subscriptionPlan!: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'SUSPENDED', 'CANCELLED'],
    default: 'ACTIVE',
  })
  subscriptionStatus!: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';

  @Column({ nullable: true })
  subscriptionExpiresAt?: Date;

  @Column({ unique: true })
  clerkOrgId!: string; // ID de organización en Clerk

  @Column({ type: 'jsonb', nullable: true })
  settings?: Record<string, any>; // Configuraciones del club

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

