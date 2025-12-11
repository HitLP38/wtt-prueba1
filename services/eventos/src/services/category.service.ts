import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * Crear categoría
   */
  async create(data: Partial<Category>): Promise<Category> {
    if (!data.organizationId || !data.eventId) {
      throw new Error('organizationId y eventId son requeridos');
    }

    // Verificar que eventCode no exista en el mismo evento
    const existing = await this.categoryRepository.findOne({
      where: {
        eventId: data.eventId,
        eventCode: data.eventCode,
        organizationId: data.organizationId,
      },
    });

    if (existing) {
      throw new ConflictException(
        `La categoría con código "${data.eventCode}" ya existe en este evento`,
      );
    }

    const category = this.categoryRepository.create(data);
    return await this.categoryRepository.save(category);
  }

  /**
   * Buscar categoría por ID y organización
   */
  async findOne(id: string, organizationId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, organizationId },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  /**
   * Listar todas las categorías de un evento
   */
  async findByEvent(eventId: string, organizationId: string): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { eventId, organizationId, isActive: true },
      order: { eventCode: 'ASC' },
    });
  }

  /**
   * Listar categorías por modalidad y género
   */
  async findByModalityAndGender(
    eventId: string,
    organizationId: string,
    modality: string,
    gender?: string,
  ): Promise<Category[]> {
    const where: any = { eventId, organizationId, isActive: true, modality };
    if (gender) {
      where.gender = gender;
    }

    return await this.categoryRepository.find({
      where,
      order: { eventCode: 'ASC' },
    });
  }

  /**
   * Actualizar categoría
   */
  async update(
    id: string,
    organizationId: string,
    data: Partial<Category>,
  ): Promise<Category> {
    const category = await this.findOne(id, organizationId);

    // Si se cambia eventCode, verificar unicidad
    if (data.eventCode && data.eventCode !== category.eventCode) {
      const existing = await this.categoryRepository.findOne({
        where: {
          eventId: category.eventId,
          eventCode: data.eventCode,
          organizationId,
        },
      });

      if (existing) {
        throw new ConflictException(
          `El código "${data.eventCode}" ya existe en este evento`,
        );
      }
    }

    Object.assign(category, data);
    return await this.categoryRepository.save(category);
  }

  /**
   * Eliminar categoría (soft delete - desactivar)
   */
  async remove(id: string, organizationId: string): Promise<void> {
    const category = await this.findOne(id, organizationId);
    category.isActive = false;
    await this.categoryRepository.save(category);
  }

  /**
   * Eliminar múltiples categorías
   */
  async removeMultiple(ids: string[], organizationId: string): Promise<void> {
    await this.categoryRepository.update(
      { id: { $in: ids } as any, organizationId },
      { isActive: false },
    );
  }
}

