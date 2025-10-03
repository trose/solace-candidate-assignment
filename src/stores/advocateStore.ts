import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { Advocate } from '../types/advocate';

/**
 * Search parameters for advocate search
 */
export interface SearchParams {
  /** General search term for name, city, degree, or specialties */
  search?: string;
  /** Filter by city */
  city?: string;
  /** Filter by degree */
  degree?: string;
  /** Minimum years of experience */
  minExperience?: string;
  /** Maximum years of experience */
  maxExperience?: string;
  /** Filter by specialty */
  specialty?: string;
  /** Limit number of results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Search result interface
 */
export interface SearchResult {
  advocates: Advocate[];
  total: number;
  limit?: number | null;
  offset?: number | null;
}

/**
 * Pagination state
 */
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

/**
 * Filter state
 */
export interface FilterState {
  search: string;
  city: string;
  degree: string;
  minExperience: string;
  maxExperience: string;
  specialty: string;
}

/**
 * Advocate store state
 */
interface AdvocateStoreState {
  // Data
  advocates: Advocate[];
  total: number;
  loading: boolean;
  error: string | null;

  // Pagination
  pagination: PaginationState;

  // Filters
  filters: FilterState;

  // Actions
  setAdvocates: (advocates: Advocate[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Pagination actions
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setTotalItems: (total: number) => void;

  // Filter actions
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Search actions
  searchAdvocates: (params: SearchParams) => Promise<void>;
  loadAllAdvocates: () => Promise<void>;

  // Utility actions
  reset: () => void;
}

/**
 * Default filter state
 */
const defaultFilters: FilterState = {
  search: '',
  city: '',
  degree: '',
  minExperience: '',
  maxExperience: '',
  specialty: '',
};

/**
 * Default pagination state
 */
const defaultPagination: PaginationState = {
  currentPage: 1,
  itemsPerPage: 25,
  totalItems: 0,
};

/**
 * Zustand store for advocate state management
 * Provides centralized state management for advocates, filters, pagination, and search
 */
export const useAdvocateStore = create<AdvocateStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        advocates: [],
        total: 0,
        loading: false,
        error: null,
        pagination: defaultPagination,
        filters: defaultFilters,

        // Data setters
        setAdvocates: (advocates) => set({ advocates }),
        setTotal: (total) => set({ total }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        // Pagination actions
        setCurrentPage: (currentPage) =>
          set((state) => ({
            pagination: { ...state.pagination, currentPage }
          })),

        setItemsPerPage: (itemsPerPage) =>
          set((state) => ({
            pagination: { ...state.pagination, itemsPerPage, currentPage: 1 }
          })),

        setTotalItems: (totalItems) =>
          set((state) => ({
            pagination: { ...state.pagination, totalItems }
          })),

        // Filter actions
        setFilters: (newFilters) =>
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
            pagination: { ...state.pagination, currentPage: 1 }
          })),

        resetFilters: () =>
          set({
            filters: defaultFilters,
            pagination: { ...defaultPagination, totalItems: get().pagination.totalItems }
          }),

        // Search actions
        searchAdvocates: async (params: SearchParams) => {
          set({ loading: true, error: null });

          try {
            const searchParams = new URLSearchParams();

            if (params.search) {
              searchParams.set('search', params.search);
            }
            if (params.city) {
              searchParams.set('city', params.city);
            }
            if (params.degree) {
              searchParams.set('degree', params.degree);
            }
            if (params.minExperience) {
              searchParams.set('minExperience', params.minExperience);
            }
            if (params.maxExperience) {
              searchParams.set('maxExperience', params.maxExperience);
            }
            if (params.specialty) {
              searchParams.set('specialty', params.specialty);
            }
            if (params.limit) {
              searchParams.set('limit', params.limit.toString());
            }
            if (params.offset) {
              searchParams.set('offset', params.offset.toString());
            }

            const response = await fetch(`/api/advocates/search?${searchParams.toString()}`);

            if (!response.ok) {
              throw new Error('Failed to search advocates');
            }

            const result: SearchResult = await response.json();

            set({
              advocates: result.advocates,
              total: result.total,
              pagination: {
                ...get().pagination,
                totalItems: result.total,
                limit: result.limit || get().pagination.itemsPerPage,
                offset: result.offset || 0,
              },
              loading: false,
            });
          } catch (err) {
            set({
              error: err instanceof Error ? err.message : 'An error occurred',
              advocates: [],
              total: 0,
              loading: false,
            });
          }
        },

        loadAllAdvocates: async () => {
          set({ loading: true, error: null });

          try {
            // Add cache-busting parameter to force fresh data
            const cacheBuster = `_cb=${Date.now()}`;
            const response = await fetch(`/api/advocates?${cacheBuster}`);

            if (!response.ok) {
              throw new Error('Failed to fetch advocates');
            }

            const result = await response.json();

            set({
              advocates: result.advocates,
              total: result.advocates.length,
              pagination: {
                ...get().pagination,
                totalItems: result.advocates.length,
                currentPage: 1,
              },
              loading: false,
            });
          } catch (err) {
            set({
              error: err instanceof Error ? err.message : 'An error occurred',
              advocates: [],
              total: 0,
              loading: false,
            });
          }
        },

        // Utility actions
        reset: () =>
          set({
            advocates: [],
            total: 0,
            loading: false,
            error: null,
            pagination: defaultPagination,
            filters: defaultFilters,
          }),
      }),
      {
        name: 'advocate-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: {
            itemsPerPage: state.pagination.itemsPerPage,
            currentPage: state.pagination.currentPage,
            totalItems: state.pagination.totalItems,
          },
        }),
      }
    ),
    {
      name: 'advocate-store',
    }
  )
);

/**
 * Selector hooks for better performance
 */
export const useAdvocates = () => useAdvocateStore((state) => state.advocates);
export const useAdvocatesLoading = () => useAdvocateStore((state) => state.loading);
export const useAdvocatesError = () => useAdvocateStore((state) => state.error);
export const useAdvocatesTotal = () => useAdvocateStore((state) => state.total);
export const useAdvocatesPagination = () => useAdvocateStore((state) => state.pagination);
export const useAdvocatesFilters = () => useAdvocateStore((state) => state.filters);
// Atomic selectors for individual actions to prevent unnecessary re-renders
export const useSetAdvocates = () => useAdvocateStore((state) => state.setAdvocates);
export const useSetTotal = () => useAdvocateStore((state) => state.setTotal);
export const useSetLoading = () => useAdvocateStore((state) => state.setLoading);
export const useSetError = () => useAdvocateStore((state) => state.setError);
export const useSetCurrentPage = () => useAdvocateStore((state) => state.setCurrentPage);
export const useSetItemsPerPage = () => useAdvocateStore((state) => state.setItemsPerPage);
export const useSetTotalItems = () => useAdvocateStore((state) => state.setTotalItems);
export const useSetFilters = () => useAdvocateStore((state) => state.setFilters);
export const useResetFilters = () => useAdvocateStore((state) => state.resetFilters);
export const useSearchAdvocates = () => useAdvocateStore((state) => state.searchAdvocates);
export const useLoadAllAdvocates = () => useAdvocateStore((state) => state.loadAllAdvocates);
export const useReset = () => useAdvocateStore((state) => state.reset);

// Combined selector with shallow comparison for cases where multiple actions are needed
export const useAdvocatesActions = () => useAdvocateStore((state) => ({
  setAdvocates: state.setAdvocates,
  setTotal: state.setTotal,
  setLoading: state.setLoading,
  setError: state.setError,
  setCurrentPage: state.setCurrentPage,
  setItemsPerPage: state.setItemsPerPage,
  setTotalItems: state.setTotalItems,
  setFilters: state.setFilters,
  resetFilters: state.resetFilters,
  searchAdvocates: state.searchAdvocates,
  loadAllAdvocates: state.loadAllAdvocates,
  reset: state.reset,
}), shallow);
