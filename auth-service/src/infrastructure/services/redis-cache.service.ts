import Redis from "ioredis"
import type { ICacheService } from "../../application/services/cache.service"

export class RedisCacheService implements ICacheService {
  private static instance: Redis

  private getClient(): Redis {
    if (!RedisCacheService.instance) {
      RedisCacheService.instance = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000)
          return delay
        },
      })
    }

    return RedisCacheService.instance
  }

  async get(key: string): Promise<string | null> {
    return await this.getClient().get(key)
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.getClient().setex(key, ttl, value)
    } else {
      await this.getClient().set(key, value)
    }
  }

  async delete(key: string): Promise<void> {
    await this.getClient().del(key)
  }

  async clear(): Promise<void> {
    await this.getClient().flushdb()
  }

  static async disconnect(): Promise<void> {
    if (RedisCacheService.instance) {
      await RedisCacheService.instance.quit()
    }
  }
}
