import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Lazy-loaded components for better performance and code splitting
 * These components are loaded only when needed, reducing the initial bundle size
 */

// Lazy load heavy components
export const LazyAdvocateTable = dynamic(
  () => import('./AdvocateTable').then(mod => ({ default: mod.AdvocateTable })),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-8 w-full rounded mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-gray-200 h-12 w-full rounded"></div>
          ))}
        </div>
      </div>
    ),
    ssr: false, // Disable SSR for better performance
  }
);

export const LazyAdvancedFilters = dynamic(
  () => import('./AdvancedFilters').then(mod => ({ default: mod.AdvancedFilters })),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-16 w-full rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 h-10 w-full rounded"></div>
          ))}
        </div>
      </div>
    ),
    ssr: false,
  }
);

export const LazyPagination = dynamic(
  () => import('./Pagination').then(mod => ({ default: mod.Pagination })),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-12 w-full rounded"></div>
      </div>
    ),
    ssr: false,
  }
);

export const LazyAdvocateForm = dynamic(
  () => import('./AdvocateForm').then(mod => ({ default: mod.AdvocateForm })),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-10 w-full rounded"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-32 w-full rounded"></div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export const LazySkeletonTable = dynamic(
  () => import('./SkeletonTable').then(mod => ({ default: mod.SkeletonTable })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-64 w-full rounded"></div>,
    ssr: false,
  }
);

export const LazySkeletonFilters = dynamic(
  () => import('./SkeletonFilters').then(mod => ({ default: mod.SkeletonFilters })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-32 w-full rounded"></div>,
    ssr: false,
  }
);

/**
 * Higher-order component for lazy loading with error boundaries
 */
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  fallback?: ComponentType
) {
  return dynamic(() => Promise.resolve(Component), {
    loading: fallback ? () => <fallback /> : undefined,
    ssr: false,
  });
}

/**
 * Lazy load the entire SearchClient component
 */
export const LazySearchClient = dynamic(
  () => import('./SearchClient').then(mod => ({ default: mod.SearchClient })),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-200 h-32 w-full rounded"></div>
        <div className="animate-pulse bg-gray-200 h-64 w-full rounded"></div>
      </div>
    ),
    ssr: false,
  }
);

/**
 * Lazy load the SearchClient with Zustand store
 */
export const LazySearchClientWithStore = dynamic(
  () => import('./SearchClientWithStore').then(mod => ({ default: mod.SearchClientWithStore })),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-200 h-32 w-full rounded"></div>
        <div className="animate-pulse bg-gray-200 h-64 w-full rounded"></div>
      </div>
    ),
    ssr: false,
  }
);

/**
 * Lazy load the Advocate app with context provider
 */
export const LazyAdvocateApp = dynamic(
  () => import('./AdvocateApp').then(mod => ({ default: mod.AdvocateApp })),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-200 h-32 w-full rounded"></div>
        <div className="animate-pulse bg-gray-200 h-64 w-full rounded"></div>
      </div>
    ),
    ssr: false,
  }
);
