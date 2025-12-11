import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventSettings } from '../entities/event-settings.entity';

@Injectable()
export class EventSettingsService {
  constructor(
    @InjectRepository(EventSettings)
    private settingsRepository: Repository<EventSettings>,
  ) {}

  /**
   * Obtiene configuración de un evento (crea default si no existe)
   */
  async getSettings(eventId: string): Promise<EventSettings> {
    let settings = await this.settingsRepository.findOne({
      where: { eventId },
    });

    if (!settings) {
      // Crear configuración por defecto
      settings = this.settingsRepository.create({
        eventId,
        defaultSetsToWin: 5,
        finalSetsToWin: 7,
        allowTableUnfolding: true,
        matchDurationEstimate: 30,
        tableChangeTime: 15,
      });
      settings = await this.settingsRepository.save(settings);
    }

    return settings;
  }

  /**
   * Actualiza configuración de un evento
   */
  async updateSettings(
    eventId: string,
    updates: Partial<EventSettings>,
  ): Promise<EventSettings> {
    let settings = await this.settingsRepository.findOne({
      where: { eventId },
    });

    if (!settings) {
      settings = this.settingsRepository.create({
        eventId,
        ...updates,
      });
    } else {
      Object.assign(settings, updates);
    }

    return await this.settingsRepository.save(settings);
  }
}

