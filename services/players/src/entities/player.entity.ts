import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('players')
@Index(['clerkId']) // Login con Clerk
@Index(['licenseNumber']) // Búsqueda por licencia
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, nullable: true })
  clerkId?: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  whatsapp?: string; // WhatsApp para notificaciones

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  licenseNumber?: string; // Licencia ITTF

  @Column({ nullable: true })
  club?: string;

  @Column({ nullable: true })
  nationality?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ default: 0 })
  currentRanking!: number; // Ranking actual (actualizado dinámicamente)

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

