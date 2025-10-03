/**
 * Redis-based cache for database queries
 * Provides distributed caching with TTL and automatic cleanup
 */

import Redis from 'ioredis';

interface CacheStats {
  size: number;
  keys: string[];
  hitRate?: number;
}

class RedisCache {
  private redis: Redis;
  private defaultTTL = 5 * 60; // 5 minutes in seconds (Redis uses seconds)
  private hitCount = 0;
  private missCount = 0;
  private isConnected = false;

  constructor() {
    // Redis connection configuration
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true, // Don't connect immediately
      connectTimeout: 10000,
      commandTimeout: 5000,
    };

    this.redis = new Redis(redisConfig);

    // Handle connection events
    this.redis.on('connect', () => {
      this.isConnected = true;
      console.log('Redis connected successfully');
    });

    this.redis.on('error', (error) => {
      this.isConnected = false;
      console.error('Redis connection error:', error);
    });

    this.redis.on('close', () => {
      this.isConnected = false;
      console.log('Redis connection closed');
    });

    // Graceful shutdown
    process.on('SIGINT', () => this.disconnect());
    process.on('SIGTERM', () => this.disconnect());
  }

  /**
   * Set a value in the cache with optional TTL
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in seconds (optional)
   */
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    if (!key || key.trim() === '') {
      throw new Error('Cache key cannot be empty');
    }

    if (!this.isConnected) {
      console.warn('Redis not connected, skipping cache set');
      return;
    }

    try {
      const serializedData = JSON.stringify(data);
      const ttlSeconds = ttl || this.defaultTTL;
      
      await this.redis.setex(key, ttlSeconds, serializedData);
    } catch (error) {
      console.error('Redis set error:', error);
      // Don't throw - cache failures shouldn't break the application
    }
  }

  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns Cached data or null if not found/expired
   */
  async get<T>(key: string): Promise<T | null> {
    if (!key || key.trim() === '') {
      return null;
    }

    if (!this.isConnected) {
      this.missCount++;
      return null;
    }

    try {
      const result = await this.redis.get(key);
      
      if (result === null) {
        this.missCount++;
        return null;
      }

      this.hitCount++;
      return JSON.parse(result) as T;
    } catch (error) {
      console.error('Redis get error:', error);
      this.missCount++;
      return null;
    }
  }

  /**
   * Delete a specific key from the cache
   * @param key - Cache key to delete
   */
  async delete(key: string): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  /**
   * Clear all entries from the cache
   */
  async clear(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.redis.flushdb();
      this.hitCount = 0;
      this.missCount = 0;
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  }

  /**
   * Get cache statistics including hit rate
   * @returns Cache statistics
   */
  async getStats(): Promise<CacheStats> {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? this.hitCount / totalRequests : 0;

    let keys: string[] = [];
    let size = 0;

    if (this.isConnected) {
      try {
        keys = await this.redis.keys('*');
        size = keys.length;
      } catch (error) {
        console.error('Redis stats error:', error);
      }
    }

    return {
      size,
      keys,
      hitRate: Math.round(hitRate * 100) / 100, // Round to 2 decimal places
    };
  }

  /**
   * Check if Redis is connected
   */
  isRedisConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      console.error('Redis disconnect error:', error);
    }
  }

  /**
   * Connect to Redis (if not already connected)
   */
  async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.redis.connect();
      } catch (error) {
        console.error('Redis connect error:', error);
      }
    }
  }
}

// Create a singleton instance
const cache = new RedisCache();

// Initialize connection
cache.connect().catch((error) => {
  console.error('Failed to initialize Redis connection:', error);
});

export { cache };

// Cache key generators
export const cacheKeys = {
  advocates: {
    all: 'advocates:all',
    search: (params: Record<string, string>) => `advocates:search:${JSON.stringify(params)}`,
    byId: (id: number) => `advocates:id:${id}`,
  },
} as const;