import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('event_registration')
@Index(['eventId'], { unique: true }) // Una configuración de inscripciones por evento
@Index(['organizationId']) // Índice multi-tenant
@Index(['registrationStartDate', 'registrationEndDate']) // Fechas de inscripción
export class EventRegistration {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventId!: string; // FK a Event (UNIQUE)

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  // Fechas de inscripción
  @Column({ nullable: true })
  registrationStartDate?: Date; // Inicio de inscripciones

  @Column({ nullable: true })
  registrationEndDate?: Date; // Fin de inscripciones (ej: "25 de Mayo, 22:00")

  // Contacto del evento
  @Column({ nullable: true })
  eventWhatsApp?: string;

  @Column({ nullable: true })
  eventEmail1?: string;

  @Column({ nullable: true })
  eventEmail2?: string;

  @Column({ nullable: true })
  eventPhone?: string;

  // Información de pago
  @Column({ nullable: true })
  paymentAccountHolder?: string; // Ej: "Topspin Sports SAC"

  @Column({ nullable: true })
  paymentAccountNumber?: string; // Ej: "193-7130809-0-71"

  @Column({ nullable: true })
  paymentBank?: string; // Ej: "BCP"

  @Column({ nullable: true })
  paymentCCI?: string; // Código CCI (Interbank Account Code)

  @Column({ nullable: true })
  paymentYape?: string; // Número de YAPE (si aplica)

  @Column({ nullable: true, type: 'text' })
  paymentNotes?: string; // Notas adicionales sobre pagos

  @Column({ default: false })
  requiresInvoice!: boolean; // Si requiere facturación

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

