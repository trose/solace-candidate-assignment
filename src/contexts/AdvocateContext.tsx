"use client";

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Advocate } from '../types/advocate';

// Types
interface FilterState {
  search: string;
  city: string;
  degree: string;
  minExperience: string;
  maxExperience: string;
  specialty: string;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

interface AdvocateState {
  advocates: Advocate[];
  loading: boolean;
  error: string | null;
  total: number;
  pagination: PaginationState;
  filters: FilterState;
}

// Action types
type AdvocateAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ADVOCATES'; payload: Advocate[] }
  | { type: 'SET_TOTAL'; payload: number }
  | { type: 'SET_PAGINATION'; payload: Partial<PaginationState> }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'RESET_FILTERS' }
  | { type: 'RESET' };

// Initial state
const initialState: AdvocateState = {
  advocates: [],
  loading: false,
  error: null,
  total: 0,
  pagination: {
    currentPage: 1,
    itemsPerPage: 25,
    totalItems: 0,
  },
  filters: {
    search: '',
    city: '',
    degree: '',
    minExperience: '',
    maxExperience: '',
    specialty: '',
  },
};

// Reducer
function advocateReducer(state: AdvocateState, action: AdvocateAction): AdvocateState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ADVOCATES':
      return { ...state, advocates: action.payload };
    case 'SET_TOTAL':
      return { ...state, total: action.payload };
    case 'SET_PAGINATION':
      return { 
        ...state, 
        pagination: { ...state.pagination, ...action.payload } 
      };
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload } 
      };
    case 'RESET_FILTERS':
      return { 
        ...state, 
        filters: initialState.filters 
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Context
interface AdvocateContextType {
  state: AdvocateState;
  dispatch: React.Dispatch<AdvocateAction>;
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAdvocates: (advocates: Advocate[]) => void;
  setTotal: (total: number) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  searchAdvocates: (params: Record<string, string | number | undefined>) => Promise<void>;
  loadAllAdvocates: () => Promise<void>;
  reset: () => void;
}

const AdvocateContext = createContext<AdvocateContextType | undefined>(undefined);

// Provider component
export function AdvocateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(advocateReducer, initialState);

  // Action creators
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setAdvocates = useCallback((advocates: Advocate[]) => {
    dispatch({ type: 'SET_ADVOCATES', payload: advocates });
  }, []);

  const setTotal = useCallback((total: number) => {
    dispatch({ type: 'SET_TOTAL', payload: total });
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGINATION', payload: { currentPage: page } });
  }, []);

  const setItemsPerPage = useCallback((itemsPerPage: number) => {
    dispatch({ type: 'SET_PAGINATION', payload: { itemsPerPage, currentPage: 1 } });
  }, []);

  const setFilters = useCallback((filters: Partial<FilterState>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const searchAdvocates = useCallback(async (params: Record<string, string | number | undefined>) => {
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
      dispatch({ 
        type: 'SET_PAGINATION', 
        payload: { 
          totalItems: result.total,
          limit: result.limit || state.pagination.itemsPerPage,
          offset: result.offset || 0,
        } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAdvocates([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setAdvocates, setTotal, state.pagination.itemsPerPage]);

  const loadAllAdvocates = useCallback(async () => {
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
      dispatch({ 
        type: 'SET_PAGINATION', 
        payload: { 
          totalItems: result.advocates.length,
          currentPage: 1,
        } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAdvocates([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setAdvocates, setTotal]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const contextValue: AdvocateContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    setAdvocates,
    setTotal,
    setCurrentPage,
    setItemsPerPage,
    setFilters,
    resetFilters,
    searchAdvocates,
    loadAllAdvocates,
    reset,
  };

  return (
    <AdvocateContext.Provider value={contextValue}>
      {children}
    </AdvocateContext.Provider>
  );
}

// Hook to use the context
export function useAdvocateContext() {
  const context = useContext(AdvocateContext);
  if (context === undefined) {
    throw new Error('useAdvocateContext must be used within an AdvocateProvider');
  }
  return context;
}

// Convenience hooks for specific state slices
export function useAdvocates() {
  const { state } = useAdvocateContext();
  return state.advocates;
}

export function useAdvocatesLoading() {
  const { state } = useAdvocateContext();
  return state.loading;
}

export function useAdvocatesError() {
  const { state } = useAdvocateContext();
  return state.error;
}

export function useAdvocatesPagination() {
  const { state } = useAdvocateContext();
  return state.pagination;
}

export function useAdvocatesFilters() {
  const { state } = useAdvocateContext();
  return state.filters;
}
