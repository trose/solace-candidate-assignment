import { useState, useEffect, useCallback } from 'react';
import { Advocate } from '../types/advocate';

/**
 * Search parameters for advocate search
 */
interface SearchParams {
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
interface SearchResult {
  advocates: Advocate[];
  total: number;
  limit?: number | null;
  offset?: number | null;
}

/**
 * Provides state and actions for fetching and searching advocates from the API.
 *
 * @returns An object containing:
 * - `advocates` — the current list of advocates
 * - `loading` — whether a fetch is in progress
 * - `error` — an error message if the last operation failed, or `null`
 * - `total` — total number of advocates matching the last fetch
 * - `searchAdvocates` — function accepting `SearchParams` to perform a server-side search and update the state
 * - `loadAllAdvocates` — function to load all advocates and update the state
 */
export function useAdvocateSearch() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  /**
   * Search advocates with advanced filtering
   * @param params - Search parameters
   */
  const searchAdvocates = useCallback(async (params: SearchParams = {}) => {
    setLoading(true);
    setError(null);

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
      setAdvocates(result.advocates);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAdvocates([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAllAdvocates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/advocates');

      if (!response.ok) {
        throw new Error('Failed to fetch advocates');
      }

      const result = await response.json();
      setAdvocates(result.advocates);
      setTotal(result.advocates.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAdvocates([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all advocates on mount
  useEffect(() => {
    loadAllAdvocates();
  }, [loadAllAdvocates]);

  return {
    advocates,
    loading,
    error,
    total,
    searchAdvocates,
    loadAllAdvocates,
  };
}