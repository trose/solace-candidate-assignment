"use client";

import React, { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useAdvocateStore } from "../stores/advocateStore";
import { SearchInput } from "./SearchInput";

interface SearchBarProps {
  isLoading?: boolean;
}

/**
 * Static search bar component that's always visible
 * Handles search input with debouncing to prevent focus loss
 */
export const SearchBar: React.FC<SearchBarProps> = ({ isLoading = false }) => {
  const [searchValue, setSearchValue] = useState('');

  // Use Zustand store actions (stable selectors)
  const setFilters = useAdvocateStore((state) => state.setFilters);
  const setPagination = useAdvocateStore((state) => state.setPagination);
  const searchAdvocates = useAdvocateStore((state) => state.searchAdvocates);
  const loadAllAdvocates = useAdvocateStore((state) => state.loadAllAdvocates);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setFilters({ search: value });
    setPagination({ currentPage: 1 });

    if (value.trim()) {
      searchAdvocates({
        search: value,
        limit: 25,
        offset: 0,
      });
    } else {
      loadAllAdvocates();
    }
  }, 1000);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Search Advocates</h3>
      </div>

      <div className="mb-4">
        <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <SearchInput
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search by name, city, degree, or specialty..."
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
