import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from '@wtt/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Crear nuevo usuario
   */
  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  /**
   * Buscar usuario por ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  /**
   * Buscar usuario por Clerk ID
   */
  async findByClerkId(clerkId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { clerkId },
    });
  }

  /**
   * Buscar usuarios por organización
   */
  async findByOrganization(organizationId: string): Promise<User[]> {
    return await this.userRepository.find({
      where: { organizationId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Buscar usuarios por rol en una organización
   */
  async findByOrganizationAndRole(
    organizationId: string,
    role: UserRole,
  ): Promise<User[]> {
    return await this.userRepository.find({
      where: { organizationId, role, isActive: true },
    });
  }

  /**
   * Actualizar usuario
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return await this.userRepository.save(user);
  }

  /**
   * Actualizar último login
   */
  async updateLastLogin(clerkId: string): Promise<void> {
    const user = await this.findByClerkId(clerkId);
    if (user) {
      user.lastLoginAt = new Date();
      await this.userRepository.save(user);
    }
  }

  /**
   * Desactivar usuario
   */
  async deactivate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    return await this.userRepository.save(user);
  }
}

