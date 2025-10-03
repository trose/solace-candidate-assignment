import { useState, useEffect } from 'react';
import { Advocate } from '../types/advocate';

export const useAdvocates = () => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAdvocates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/advocates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Validate that data.advocates is an array of Advocate
        if (data && Array.isArray(data.advocates)) {
          setAdvocates(data.advocates);
        } else {
          setAdvocates([]);
        }
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
        setAdvocates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  return { advocates, loading, error };
};