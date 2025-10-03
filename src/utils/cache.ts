/**
 * Simple in-memory cache for database queries
 * In production, consider using Redis or similar distributed cache
 */

// Extend globalThis interface for cache cleanup interval
declare global {
  // eslint-disable-next-line no-var
  var __cacheCleanupInterval: NodeJS.Timeout | null | undefined;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheStats {
  size: number;
  keys: string[];
  hitRate?: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default
  private hitCount = 0;
  private missCount = 0;

  /**
   * Set a value in the cache with optional TTL
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in milliseconds (optional)
   */
  set<T>(key: string, data: T, ttl?: number): void {
    if (!key || key.trim() === '') {
      throw new Error('Cache key cannot be empty');
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };
    this.cache.set(key, entry);
  }

  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns Cached data or null if not found/expired
   */
  get<T>(key: string): T | null {
    if (!key || key.trim() === '') {
      return null;
    }

    const entry = this.cache.get(key);

    if (!entry) {
      this.missCount++;
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    this.hitCount++;
    return entry.data as T;
  }

  /**
   * Delete a specific key from the cache
   * @param key - Cache key to delete
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Get cache statistics including hit rate
   * @returns Cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? this.hitCount / totalRequests : 0;

    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      hitRate: Math.round(hitRate * 100) / 100, // Round to 2 decimal places
    };
  }
}

// Create a singleton instance
const cache = new MemoryCache();

// Clean up expired entries every 10 minutes
// Store interval handle to prevent memory leaks in Next.js
let cleanupInterval: NodeJS.Timeout | null | undefined = null;

function startCleanupInterval() {
  // Clear any existing interval to prevent duplicates
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }

  cleanupInterval = setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}

function stopCleanupInterval() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = undefined;
  }
}

// Start cleanup interval
startCleanupInterval();

// Store cleanup functions on globalThis for Next.js hot reload handling
if (typeof globalThis !== 'undefined') {
  // Clear existing interval on module reload
  if (globalThis.__cacheCleanupInterval) {
    clearInterval(globalThis.__cacheCleanupInterval);
  }
  globalThis.__cacheCleanupInterval = cleanupInterval;
}

export { cache, stopCleanupInterval };

// Cache key generators
export const cacheKeys = {
  advocates: {
    all: 'advocates:all',
    search: (params: Record<string, string>) => `advocates:search:${JSON.stringify(params)}`,
    byId: (id: number) => `advocates:id:${id}`,
  },
} as const;

// Make this file a module to enable global declarations
export {};

