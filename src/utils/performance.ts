/**
 * Performance monitoring utilities for the application
 * Provides methods to measure and track performance metrics
 */

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private observers: Set<(metric: PerformanceMetric) => void> = new Set();

  /**
   * Start timing a performance metric
   */
  startTiming(name: string, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata,
    };
    this.metrics.set(name, metric);
  }

  /**
   * End timing a performance metric
   */
  endTiming(name: string): PerformanceMetric | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" not found`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetric = {
      ...metric,
      endTime,
      duration,
    };

    this.metrics.set(name, completedMetric);
    this.notifyObservers(completedMetric);

    return completedMetric;
  }

  /**
   * Get a performance metric
   */
  getMetric(name: string): PerformanceMetric | null {
    return this.metrics.get(name) || null;
  }

  /**
   * Get all performance metrics
   */
  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Subscribe to performance metric updates
   */
  subscribe(observer: (metric: PerformanceMetric) => void): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  /**
   * Notify observers of metric updates
   */
  private notifyObservers(metric: PerformanceMetric): void {
    this.observers.forEach(observer => {
      try {
        observer(metric);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in performance observer:', error);
      }
    });
  }

  /**
   * Measure the execution time of a function
   */
  async measureFunction<T>(
    name: string,
    fn: () => Promise<T> | T,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startTiming(name, metadata);
    try {
      const result = await fn();
      this.endTiming(name);
      return result;
    } catch (error) {
      this.endTiming(name);
      throw error;
    }
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    totalMetrics: number;
    averageDuration: number;
    slowestMetric: PerformanceMetric | null;
    fastestMetric: PerformanceMetric | null;
    } {
    const metrics = this.getAllMetrics().filter(m => m.duration !== undefined);

    if (metrics.length === 0) {
      return {
        totalMetrics: 0,
        averageDuration: 0,
        slowestMetric: null,
        fastestMetric: null,
      };
    }

    const durations = metrics.map(m => m.duration!);
    const averageDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;

    const slowestMetric = metrics.reduce((slowest, current) =>
      current.duration! > slowest.duration! ? current : slowest
    );

    const fastestMetric = metrics.reduce((fastest, current) =>
      current.duration! < fastest.duration! ? current : fastest
    );

    return {
      totalMetrics: metrics.length,
      averageDuration,
      slowestMetric,
      fastestMetric,
    };
  }
}

// Create a singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for measuring component performance
 */
export function usePerformanceMeasurement(componentName: string) {
  const startTiming = () => {
    performanceMonitor.startTiming(componentName, {
      component: componentName,
      timestamp: new Date().toISOString(),
    });
  };

  const endTiming = () => {
    return performanceMonitor.endTiming(componentName);
  };

  const measureRender = <T>(fn: () => T): T => {
    startTiming();
    const result = fn();
    endTiming();
    return result;
  };

  return {
    startTiming,
    endTiming,
    measureRender,
  };
}

/**
 * Higher-order function for measuring async operations
 */
export function withPerformanceMeasurement<T extends unknown[], R>(
  name: string,
  fn: (...args: T) => Promise<R> | R,
  metadata?: Record<string, unknown>
) {
  return async (...args: T): Promise<R> => {
    return performanceMonitor.measureFunction(name, () => fn(...args), metadata);
  };
}

/**
 * Web Vitals monitoring
 */
export function measureWebVitals() {
  if (typeof window === 'undefined') {return;}

  // Measure First Contentful Paint (FCP)
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          performanceMonitor.startTiming('FCP', {
            value: entry.startTime,
            type: 'web-vital',
          });
          performanceMonitor.endTiming('FCP');
        }
      }
    });
    observer.observe({ entryTypes: ['paint'] });
  }

  // Measure Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        performanceMonitor.startTiming('LCP', {
          value: entry.startTime,
          type: 'web-vital',
        });
        performanceMonitor.endTiming('LCP');
      }
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // Measure Cumulative Layout Shift (CLS)
  if ('PerformanceObserver' in window) {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as Record<string, unknown>).hadRecentInput) {
          clsValue += (entry as Record<string, unknown>).value as number;
        }
      }
      performanceMonitor.startTiming('CLS', {
        value: clsValue,
        type: 'web-vital',
      });
      performanceMonitor.endTiming('CLS');
    });
    observer.observe({ entryTypes: ['layout-shift'] });
  }
}

/**
 * Bundle size monitoring
 */
export function measureBundleSize() {
  if (typeof window === 'undefined') {return;}

  // Measure initial bundle size
  const scripts = document.querySelectorAll('script[src]');

  scripts.forEach(script => {
    const src = script.getAttribute('src');
    if (src) {
      // This is a simplified measurement - in production you'd want more sophisticated tracking
      performanceMonitor.startTiming('bundle-size', {
        type: 'bundle',
        script: src,
      });
    }
  });

  performanceMonitor.endTiming('bundle-size');
}

/**
 * Memory usage monitoring
 */
export function measureMemoryUsage() {
  if (typeof window === 'undefined' || !('memory' in performance)) {return;}

  const memory = (performance as Record<string, unknown>).memory;
  if (memory) {
    performanceMonitor.startTiming('memory-usage', {
      type: 'memory',
      used: (memory as Record<string, unknown>).usedJSHeapSize,
      total: (memory as Record<string, unknown>).totalJSHeapSize,
      limit: (memory as Record<string, unknown>).jsHeapSizeLimit,
    });
    performanceMonitor.endTiming('memory-usage');
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  measureWebVitals();
  measureBundleSize();
  measureMemoryUsage();
}
