import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  /**
   * Listar todos los eventos de una organización
   * CRÍTICO: Siempre filtrar por organizationId
   */
  async findAll(organizationId: string) {
    return this.eventRepository.find({
      where: { organizationId, isActive: true },
      order: { startDate: 'DESC' },
    });
  }

  /**
   * Listar todos los eventos sin filtro (solo para MASTER)
   * @deprecated Usar solo para usuarios MASTER
   */
  async findAllWithoutFilter() {
    return this.eventRepository.find({
      where: { isActive: true },
      order: { startDate: 'DESC' },
    });
  }

  /**
   * Buscar evento por ID y organización
   * CRÍTICO: Validar que pertenezca a la organización
   */
  async findOne(id: string, organizationId: string) {
    const event = await this.eventRepository.findOne({
      where: { id, organizationId },
    });
    if (!event) {
      throw new Error('Evento no encontrado o no pertenece a la organización');
    }
    return event;
  }

  /**
   * Buscar evento por ID sin filtro (solo para MASTER)
   * @deprecated Usar solo para usuarios MASTER
   */
  async findOneWithoutFilter(id: string) {
    return this.eventRepository.findOne({ where: { id } });
  }

  /**
   * Crear evento (debe incluir organizationId)
   */
  async create(data: Partial<Event>) {
    if (!data.organizationId) {
      throw new Error('organizationId es requerido');
    }
    const event = this.eventRepository.create(data);
    return this.eventRepository.save(event);
  }
}


