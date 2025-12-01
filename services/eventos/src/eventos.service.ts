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

  async findAll() {
    return this.eventRepository.find({
      where: { isActive: true },
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.eventRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Event>) {
    const event = this.eventRepository.create(data);
    return this.eventRepository.save(event);
  }
}


