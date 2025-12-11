import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { UserRole } from '@wtt/common';

@Entity('users')
@Index(['clerkId'], { unique: true }) // ID de Clerk único
@Index(['organizationId']) // Índice crítico para queries multi-tenant
@Index(['organizationId', 'role']) // Búsqueda por org y rol
@Index(['organizationId', 'isActive']) // Filtrar usuarios activos por org
@Index(['email']) // Búsqueda por email
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  clerkId!: string; // ID de Clerk

  @Column({ nullable: true })
  organizationId?: string; // FK a Organization (null si es MASTER)

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role!: UserRole;

  @Column()
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  whatsapp?: string;

  @Column({ default: true })
  isActive!: boolean;

  // Permisos específicos (JSONB para flexibilidad)
  @Column({ type: 'jsonb', nullable: true })
  permissions?: {
    canCreateEvents?: boolean;
    canManageReferees?: boolean;
    canManageMatches?: boolean;
    canExportPDF?: boolean;
    canManageUsers?: boolean;
    canViewReports?: boolean;
    // Más permisos granulares si es necesario
  };

  @Column({ nullable: true })
  invitedBy?: string; // ID del MASTER o ADMIN que lo invitó

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

