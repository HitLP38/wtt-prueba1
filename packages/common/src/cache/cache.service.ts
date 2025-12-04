import { Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private client: RedisClientType;
  private connected = false;

  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error', err);
      this.connected = false;
    });

    this.client.on('connect', () => {
      this.logger.log('Redis Client Connected');
      this.connected = true;
    });

    // Conectar automáticamente
    this.connect();
  }

  private async connect() {
    if (!this.connected) {
      try {
        await this.client.connect();
      } catch (error) {
        this.logger.warn('Redis connection failed, cache will be disabled', error);
      }
    }
  }

  async disconnect() {
    if (this.connected) {
      await this.client.quit();
      this.connected = false;
    }
  }

  /**
   * Obtiene un valor del cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error getting cache key: ${key}`, error);
      return null;
    }
  }

  /**
   * Guarda un valor en el cache con TTL opcional
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      this.logger.error(`Error setting cache key: ${key}`, error);
    }
  }

  /**
   * Elimina una clave del cache
   */
  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Error deleting cache key: ${key}`, error);
    }
  }

  /**
   * Elimina todas las claves que coincidan con un patrón
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      this.logger.error(`Error deleting cache pattern: ${pattern}`, error);
    }
  }

  /**
   * Verifica si una clave existe en el cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error checking cache key: ${key}`, error);
      return false;
    }
  }
}

