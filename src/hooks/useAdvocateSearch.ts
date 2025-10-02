import { useState, useEffect } from 'react';
import { Advocate } from '../types/advocate';
import { filterAdvocates } from '../utils/search';

export const useAdvocateSearch = (advocates: Advocate[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);

  useEffect(() => {
    const filtered = filterAdvocates(advocates, searchTerm);
    setFilteredAdvocates(filtered);
  }, [advocates, searchTerm]);

  // Update filtered advocates when advocates change
  useEffect(() => {
    setFilteredAdvocates(advocates);
  }, [advocates]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const resetSearch = () => {
    setSearchTerm('');
  };

  return {
    searchTerm,
    filteredAdvocates,
    handleSearchChange,
    resetSearch,
  };
};