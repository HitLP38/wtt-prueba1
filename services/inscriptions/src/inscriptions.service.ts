import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscription } from './entities/inscription.entity';
import { InscriptionStatus } from '@wtt/common';

@Injectable()
export class InscriptionsService {
  constructor(
    @InjectRepository(Inscription)
    private inscriptionRepository: Repository<Inscription>,
  ) {}

  async create(data: Partial<Inscription>) {
    const inscription = this.inscriptionRepository.create({
      ...data,
      status: InscriptionStatus.PENDING,
    });
    return this.inscriptionRepository.save(inscription);
  }

  async findOne(id: string) {
    return this.inscriptionRepository.findOne({ where: { id } });
  }

  async validate(id: string, status: InscriptionStatus, reason?: string) {
    const inscription = await this.findOne(id);
    if (!inscription) {
      throw new Error('Inscription not found');
    }

    inscription.status = status;
    inscription.validatedAt = new Date();
    if (status === InscriptionStatus.REJECTED && reason) {
      inscription.rejectionReason = reason;
    }

    return this.inscriptionRepository.save(inscription);
  }
}


