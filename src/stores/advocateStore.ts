/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Advocate } from '../types/advocate';
import { FilterState, PaginationState } from '../types/advocateState';

/**
 * Search parameters for advocate search
 */
export interface SearchParams {
  search?: string;
  city?: string;
  degree?: string;
  minExperience?: string;
  maxExperience?: string;
  specialty?: string;
  limit?: number;
  offset?: number;
}

/**
 * State interface for the advocate store
 */
interface AdvocateState {
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
  setPagination: (pagination: Partial<PaginationState>) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  searchAdvocates: (params: SearchParams) => Promise<void>;
  loadAllAdvocates: () => Promise<void>;
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
 * Initial state
 */
const initialState = {
  advocates: [],
  total: 0,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    itemsPerPage: 25,
    totalItems: 0,
  },
  filters: defaultFilters,
};

/**
 * Advocate store with Zustand
 * Includes persistence, devtools, and optimized selectors
 */
export const useAdvocateStore = create<AdvocateState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setAdvocates: (advocates) => set({ advocates }, false, 'setAdvocates'),

        setTotal: (total) => set({ total }, false, 'setTotal'),

        setLoading: (loading) => set({ loading }, false, 'setLoading'),

        setError: (error) => set({ error }, false, 'setError'),

        setPagination: (pagination) =>
          set((state) => ({
            pagination: { ...state.pagination, ...pagination }
          }), false, 'setPagination'),

        setFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters }
          }), false, 'setFilters'),

        resetFilters: () =>
          set({
            filters: defaultFilters,
            pagination: {
              ...get().pagination,
              currentPage: 1,
            }
          }, false, 'resetFilters'),

        searchAdvocates: async (params) => {
          const { setLoading, setError, setAdvocates, setTotal, setPagination } = get();

          setLoading(true);
          setError(null);

          try {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
              if (value !== undefined && value !== '') {
                searchParams.append(key, value.toString());
              }
            });

            const response = await fetch(`/api/advocates/search?${searchParams.toString()}`);

            if (!response.ok) {
              throw new Error('Failed to search advocates');
            }

            const result = await response.json();
            setAdvocates(result.advocates);
            setTotal(result.total);

            // Map API response to pagination state
            const itemsPerPage = result.limit ?? get().pagination.itemsPerPage;
            const offset = result.offset ?? 0;
            const currentPage = Math.floor(offset / itemsPerPage) + 1;

            setPagination({
              totalItems: result.total,
              itemsPerPage: itemsPerPage,
              currentPage: currentPage,
            });
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setAdvocates([]);
            setTotal(0);
          } finally {
            setLoading(false);
          }
        },

        loadAllAdvocates: async () => {
          const { setLoading, setError, setAdvocates, setTotal, setPagination } = get();

          setLoading(true);
          setError(null);

          try {
            // Add cache-busting parameter to force fresh data
            const cacheBuster = `_cb=${Date.now()}`;
            const response = await fetch(`/api/advocates?${cacheBuster}`);

            if (!response.ok) {
              throw new Error('Failed to fetch advocates');
            }

            const result = await response.json();
            setAdvocates(result.advocates);
            setTotal(result.advocates.length);

            setPagination({
              totalItems: result.advocates.length,
              currentPage: 1,
              itemsPerPage: get().pagination.itemsPerPage,
            });
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setAdvocates([]);
            setTotal(0);
          } finally {
            setLoading(false);
          }
        },

        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'advocate-store',
        partialize: (state) => ({
          pagination: {
            itemsPerPage: state.pagination.itemsPerPage,
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
 * Optimized selectors for better performance
 */
export const useAdvocates = () => useAdvocateStore((state) => state.advocates);
export const useAdvocatesLoading = () => useAdvocateStore((state) => state.loading);
export const useAdvocatesError = () => useAdvocateStore((state) => state.error);
export const useAdvocatesTotal = () => useAdvocateStore((state) => state.total);
export const useAdvocatesPagination = () => useAdvocateStore((state) => state.pagination);
export const useAdvocatesFilters = () => useAdvocateStore((state) => state.filters);

/**
 * Action selectors
 */
export const useAdvocateActions = () => useAdvocateStore((state) => ({
  setAdvocates: state.setAdvocates,
  setTotal: state.setTotal,
  setLoading: state.setLoading,
  setError: state.setError,
  setPagination: state.setPagination,
  setFilters: state.setFilters,
  resetFilters: state.resetFilters,
  searchAdvocates: state.searchAdvocates,
  loadAllAdvocates: state.loadAllAdvocates,
  reset: state.reset,
}));
