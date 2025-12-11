import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('template_versions')
@Index(['templateId']) // Versiones por plantilla
@Index(['templateId', 'version'], { unique: true }) // Una versión única por número
@Index(['createdBy']) // Quién creó la versión
export class TemplateVersion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  templateId!: string; // FK a ConfigurationTemplate

  @Column()
  version!: number; // Número de versión (1, 2, 3, ...)

  // Descripción de cambios
  @Column({ type: 'jsonb' })
  changes!: {
    field: string; // Campo modificado
    change: string; // Descripción del cambio (ej: "Agregada categoría IV19")
    oldValue?: any; // Valor anterior (opcional)
    newValue?: any; // Valor nuevo (opcional)
  }[];

  // Snapshot completo de la configuración en esta versión
  @Column({ type: 'jsonb' })
  snapshot!: Record<string, any>; // Configuración completa en este momento

  @Column()
  createdBy!: string; // ID del usuario que creó esta versión

  @Column({ nullable: true, type: 'text' })
  notes?: string; // Notas adicionales sobre esta versión

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

