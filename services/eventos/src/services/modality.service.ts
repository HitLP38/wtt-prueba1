import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modality } from '../entities/modality.entity';

@Injectable()
export class ModalityService {
  constructor(
    @InjectRepository(Modality)
    private modalityRepository: Repository<Modality>,
  ) {}

  /**
   * Crear o actualizar modalidad
   * Si ya existe, la actualiza
   */
  async upsert(data: Partial<Modality>): Promise<Modality> {
    if (!data.organizationId || !data.eventId || !data.type) {
      throw new Error('organizationId, eventId y type son requeridos');
    }

    const existing = await this.modalityRepository.findOne({
      where: {
        eventId: data.eventId,
        type: data.type,
        organizationId: data.organizationId,
      },
    });

    if (existing) {
      existing.isEnabled = data.isEnabled ?? existing.isEnabled;
      return await this.modalityRepository.save(existing);
    }

    const modality = this.modalityRepository.create(data);
    return await this.modalityRepository.save(modality);
  }

  /**
   * Listar modalidades de un evento
   */
  async findByEvent(eventId: string, organizationId: string): Promise<Modality[]> {
    return await this.modalityRepository.find({
      where: { eventId, organizationId },
      order: { type: 'ASC' },
    });
  }

  /**
   * Habilitar/deshabilitar modalidad
   */
  async toggle(eventId: string, organizationId: string, type: string): Promise<Modality> {
    const modality = await this.modalityRepository.findOne({
      where: { eventId, organizationId, type: type as 'INDIVIDUAL' | 'DOUBLES' },
    });

    if (!modality) {
      throw new NotFoundException('Modalidad no encontrada');
    }

    modality.isEnabled = !modality.isEnabled;
    return await this.modalityRepository.save(modality);
  }

  /**
   * Obtener modalidad específica
   */
  async findOne(
    eventId: string,
    organizationId: string,
    type: string,
  ): Promise<Modality | null> {
    return await this.modalityRepository.findOne({
      where: { eventId, organizationId, type: type as 'INDIVIDUAL' | 'DOUBLES' },
    });
  }
}

