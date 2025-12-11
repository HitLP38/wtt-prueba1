import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('event_equipment')
@Index(['eventId'], { unique: true }) // Una configuración de equipamiento por evento
@Index(['organizationId']) // Índice multi-tenant
export class EventEquipment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventId!: string; // FK a Event (UNIQUE)

  @Column()
  organizationId!: string; // FK a Organization - CRÍTICO para multi-tenant

  @Column({ default: 0 })
  tablesCount!: number; // Número de mesas (ej: 18-22)

  @Column({ nullable: true })
  tableBrand?: string; // Marca de mesas (ej: "XIOM", "DONIC")

  @Column({ nullable: true })
  floorType?: string; // Tipo de piso (ej: "Madera")

  @Column({ nullable: true })
  ballBrand?: string; // Marca de pelotas (ej: "XIOM 3***")

  @Column({ nullable: true, type: 'text' })
  otherEquipment?: string; // Otros equipos/materiales

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

