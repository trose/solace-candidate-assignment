"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useAdvocateContext } from "../contexts/AdvocateContext";
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
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use context for state management
  const { setFilters, setCurrentPage, searchAdvocates, loadAllAdvocates } = useAdvocateContext();

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search to prevent focus loss
    searchTimeoutRef.current = setTimeout(() => {
      // Update filters and trigger search
      setFilters({ search: value });
      setCurrentPage(1);

      if (value.trim()) {
        // Search with the query
        searchAdvocates({
          search: value,
          limit: 25,
          offset: 0,
        });
      } else {
        // Load all advocates if search is empty
        loadAllAdvocates();
      }
    }, 300); // 300ms debounce
  }, [setFilters, setCurrentPage, searchAdvocates, loadAllAdvocates]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
