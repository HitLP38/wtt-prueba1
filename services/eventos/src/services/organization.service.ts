import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  /**
   * Crear nueva organización
   */
  async create(data: Partial<Organization>): Promise<Organization> {
    // Verificar que slug no exista
    const existingSlug = await this.organizationRepository.findOne({
      where: { slug: data.slug },
    });
    if (existingSlug) {
      throw new ConflictException(`El slug "${data.slug}" ya está en uso`);
    }

    // Verificar que organizationCode no exista
    if (data.organizationCode) {
      const existingCode = await this.organizationRepository.findOne({
        where: { organizationCode: data.organizationCode },
      });
      if (existingCode) {
        throw new ConflictException(
          `El código de organización "${data.organizationCode}" ya está en uso`,
        );
      }
    }

    const organization = this.organizationRepository.create(data);
    return await this.organizationRepository.save(organization);
  }

  /**
   * Buscar organización por ID
   */
  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });
    if (!organization) {
      throw new NotFoundException(`Organización con ID ${id} no encontrada`);
    }
    return organization;
  }

  /**
   * Buscar organización por slug
   */
  async findBySlug(slug: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { slug },
    });
    if (!organization) {
      throw new NotFoundException(`Organización con slug "${slug}" no encontrada`);
    }
    return organization;
  }

  /**
   * Buscar organización por organizationCode
   */
  async findByCode(code: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { organizationCode: code },
    });
    if (!organization) {
      throw new NotFoundException(`Organización con código "${code}" no encontrada`);
    }
    return organization;
  }

  /**
   * Buscar organización por Clerk Org ID
   */
  async findByClerkOrgId(clerkOrgId: string): Promise<Organization | null> {
    return await this.organizationRepository.findOne({
      where: { clerkOrgId },
    });
  }

  /**
   * Listar todas las organizaciones activas (solo para MASTER)
   */
  async findAllActive(): Promise<Organization[]> {
    return await this.organizationRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Actualizar organización
   */
  async update(id: string, data: Partial<Organization>): Promise<Organization> {
    const organization = await this.findOne(id);

    // Verificar slug único si se está cambiando
    if (data.slug && data.slug !== organization.slug) {
      const existing = await this.organizationRepository.findOne({
        where: { slug: data.slug },
      });
      if (existing) {
        throw new ConflictException(`El slug "${data.slug}" ya está en uso`);
      }
    }

    Object.assign(organization, data);
    return await this.organizationRepository.save(organization);
  }

  /**
   * Desactivar organización
   */
  async deactivate(id: string): Promise<Organization> {
    const organization = await this.findOne(id);
    organization.isActive = false;
    return await this.organizationRepository.save(organization);
  }

  /**
   * Activar organización
   */
  async activate(id: string): Promise<Organization> {
    const organization = await this.findOne(id);
    organization.isActive = true;
    return await this.organizationRepository.save(organization);
  }
}

