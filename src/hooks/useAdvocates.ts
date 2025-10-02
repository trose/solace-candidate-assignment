import { useState, useEffect } from 'react';
import { Advocate } from '../types/advocate';

export const useAdvocates = () => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);

  useEffect(() => {
    const fetchAdvocates = async () => {
      const response = await fetch('/api/advocates');
      const data = await response.json();
      setAdvocates(data.advocates as Advocate[] || []);
    };

    fetchAdvocates();
  }, []);

  return { advocates };
};