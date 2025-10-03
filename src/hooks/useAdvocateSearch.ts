import { useState, useEffect, useCallback } from 'react';
import { Advocate } from '../types/advocate';

interface SearchParams {
  search?: string;
  city?: string;
  degree?: string;
  minExperience?: string;
  maxExperience?: string;
  specialty?: string;
  limit?: number;
  offset?: number;
}

interface SearchResult {
  advocates: Advocate[];
  total: number;
  limit: number | null;
  offset: number | null;
}

export function useAdvocateSearch() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

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