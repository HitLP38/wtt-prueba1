import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum Currency {
  PEN = 'PEN', // Soles
  USD = 'USD', // Dólares
}

@Entity('event_awards')
@Index(['eventId'], { unique: true }) // Una configuración de premios por evento
@Index(['organizationId']) // Índice multi-tenant
export class EventAwards {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventId!: string; // FK a Event (UNIQUE)

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  // Reconocimientos (premios no económicos)
  @Column({ nullable: true, type: 'text' })
  recognitionFirst?: string; // Ej: "Copa y Medalla de Oro"

  @Column({ nullable: true, type: 'text' })
  recognitionSecond?: string; // Ej: "Medalla de Plata"

  @Column({ nullable: true, type: 'text' })
  recognitionThird?: string; // Ej: "Medalla de Bronce (2 terceros)"

  // Premios económicos
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  prizeFirst?: number; // Ej: 1000.00

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  prizeSecond?: number; // Ej: 500.00

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  prizeThird?: number; // Ej: 250.00

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.PEN,
  })
  currency!: Currency;

  @Column({ default: false })
  appliesToAllCategories!: boolean; // Si los premios aplican a todas las categorías

  @Column({ type: 'jsonb', nullable: true })
  categoryOverrides?: {
    categoryId: string;
    recognitionFirst?: string;
    recognitionSecond?: string;
    recognitionThird?: string;
    prizeFirst?: number;
    prizeSecond?: number;
    prizeThird?: number;
  }[]; // Premios específicos por categoría

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

