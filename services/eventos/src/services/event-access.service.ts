import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventReferee } from '../entities/event-referee.entity';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventAccessService {
  constructor(
    @InjectRepository(EventReferee)
    private eventRefereeRepository: Repository<EventReferee>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  /**
   * Verifica si un árbitro tiene acceso a un evento
   */
  async hasAccess(refereeId: string, eventId: string): Promise<boolean> {
    const access = await this.eventRefereeRepository.findOne({
      where: {
        refereeId,
        eventId,
        isEnabled: true,
      },
    });

    return !!access;
  }

  /**
   * Habilita acceso de árbitro a evento (solo admin)
   */
  async enableAccess(
    eventId: string,
    refereeId: string,
    enabledBy: string,
    notes?: string,
  ): Promise<EventReferee> {
    const existing = await this.eventRefereeRepository.findOne({
      where: { eventId, refereeId },
    });

    if (existing) {
      existing.isEnabled = true;
      existing.enabledBy = enabledBy;
      existing.enabledAt = new Date();
      existing.disabledAt = null;
      existing.notes = notes;
      return await this.eventRefereeRepository.save(existing);
    }

    const access = this.eventRefereeRepository.create({
      eventId,
      refereeId,
      isEnabled: true,
      enabledBy,
      enabledAt: new Date(),
      notes,
    });

    return await this.eventRefereeRepository.save(access);
  }

  /**
   * Deshabilita acceso (solo admin)
   */
  async disableAccess(
    eventId: string,
    refereeId: string,
    notes?: string,
  ): Promise<EventReferee> {
    const access = await this.eventRefereeRepository.findOne({
      where: { eventId, refereeId },
    });

    if (!access) {
      throw new NotFoundException('Acceso no encontrado');
    }

    access.isEnabled = false;
    access.disabledAt = new Date();
    access.notes = notes;

    return await this.eventRefereeRepository.save(access);
  }

  /**
   * Obtiene eventos accesibles para un árbitro
   */
  async getAccessibleEvents(refereeId: string): Promise<Event[]> {
    const accesses = await this.eventRefereeRepository.find({
      where: {
        refereeId,
        isEnabled: true,
      },
    });

    if (accesses.length === 0) {
      return [];
    }

    const eventIds = accesses.map((a) => a.eventId);
    const events = await this.eventRepository.find({
      where: eventIds.map((id) => ({ id })),
      order: { startDate: 'DESC' },
    });

    return events;
  }

  /**
   * Obtiene todos los árbitros de un evento
   */
  async getEventReferees(eventId: string): Promise<EventReferee[]> {
    return await this.eventRefereeRepository.find({
      where: { eventId },
      order: { createdAt: 'DESC' },
    });
  }
}

