"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useAdvocateContext } from "../contexts/AdvocateContext";
import { SearchInput } from "./SearchInput";
import { FilterInput } from "./FilterInput";
import { FilterSelect } from "./FilterSelect";

interface FilterOptions {
  search: string;
  city: string;
  degree: string;
  minExperience: string;
  maxExperience: string;
  specialty: string;
}

interface AdvancedFiltersProps {
  availableCities: string[];
  availableDegrees: string[];
  availableSpecialties: string[];
  isLoading?: boolean;
}

const AdvancedFiltersComponent: React.FC<AdvancedFiltersProps> = ({
  availableCities,
  availableDegrees,
  availableSpecialties,
  isLoading = false
}) => {
  const [filterState, setFilterState] = useState<FilterOptions>({
    search: '',
    city: '',
    degree: '',
    minExperience: '',
    maxExperience: '',
    specialty: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentFiltersRef = useRef<FilterOptions>({
    search: '',
    city: '',
    degree: '',
    minExperience: '',
    maxExperience: '',
    specialty: ''
  });

  // Use context for state management
  const { setFilters, setCurrentPage, searchAdvocates, loadAllAdvocates, resetFilters } = useAdvocateContext();

  const handleFilterChange = useCallback((field: keyof FilterOptions, value: string) => {
    // Update local state immediately
    setFilterState(prevState => {
      const newFilterState = {
        ...prevState,
        [field]: value
      };

      // Update ref to track current state
      currentFiltersRef.current = newFilterState;

      return newFilterState;
    });

    // Clear existing timeout for search field
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // For search field, use debouncing to prevent focus loss
    if (field === 'search') {
      searchTimeoutRef.current = setTimeout(() => {
        // Update store only after debounce
        setFilters(currentFiltersRef.current);
        setCurrentPage(1);

        // Convert empty strings to undefined for the API
        const searchParams = {
          search: currentFiltersRef.current.search || undefined,
          city: currentFiltersRef.current.city || undefined,
          degree: currentFiltersRef.current.degree || undefined,
          minExperience: currentFiltersRef.current.minExperience || undefined,
          maxExperience: currentFiltersRef.current.maxExperience || undefined,
          specialty: currentFiltersRef.current.specialty || undefined,
          limit: 25, // Default limit
          offset: 0,
        };

        // Check if any filters are active
        const hasActiveFilters = Object.values(searchParams).some(value => value !== undefined);

        if (hasActiveFilters) {
          searchAdvocates(searchParams);
        } else {
          loadAllAdvocates();
        }
      }, 300); // 300ms debounce
    } else {
      // For other fields, update store immediately and search
      setFilters(currentFiltersRef.current);
      setCurrentPage(1);

      const searchParams = {
        search: currentFiltersRef.current.search || undefined,
        city: currentFiltersRef.current.city || undefined,
        degree: currentFiltersRef.current.degree || undefined,
        minExperience: currentFiltersRef.current.minExperience || undefined,
        maxExperience: currentFiltersRef.current.maxExperience || undefined,
        specialty: currentFiltersRef.current.specialty || undefined,
        limit: 25, // Default limit
        offset: 0,
      };

      // Check if any filters are active
      const hasActiveFilters = Object.values(searchParams).some(value => value !== undefined);

      if (hasActiveFilters) {
        searchAdvocates(searchParams);
      } else {
        loadAllAdvocates();
      }
    }
  }, [setFilters, setCurrentPage, searchAdvocates, loadAllAdvocates]);

  const handleReset = useCallback(() => {
    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const resetState = {
      search: '',
      city: '',
      degree: '',
      minExperience: '',
      maxExperience: '',
      specialty: ''
    };

    // Update ref and state
    currentFiltersRef.current = resetState;
    setFilterState(resetState);
    resetFilters();
    setCurrentPage(1);
    loadAllAdvocates();
  }, [resetFilters, setCurrentPage, loadAllAdvocates]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const hasActiveFilters = Object.values(filterState).some(value => value.trim() !== '');

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Search & Filters</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            aria-expanded={isExpanded}
            aria-controls="advanced-filters"
          >
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </button>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Basic Search */}
      <div className="mb-4">
        <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <SearchInput
          value={filterState.search}
          onChange={(value) => handleFilterChange('search', value)}
          placeholder="Search by name, city, degree, or specialty..."
          disabled={isLoading}
        />
      </div>

      {/* Advanced Filters */}
      <div
        id="advanced-filters"
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300 ${
          isExpanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
        }`}
      >
        {/* City Filter */}
        <div>
          <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <FilterSelect
            id="city-filter"
            value={filterState.city}
            onChange={(value) => handleFilterChange('city', value)}
            options={availableCities}
            placeholder="All Cities"
            disabled={isLoading}
          />
        </div>

        {/* Degree Filter */}
        <div>
          <label htmlFor="degree-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Degree
          </label>
          <FilterSelect
            id="degree-filter"
            value={filterState.degree}
            onChange={(value) => handleFilterChange('degree', value)}
            options={availableDegrees}
            placeholder="All Degrees"
            disabled={isLoading}
          />
        </div>

        {/* Specialty Filter */}
        <div>
          <label htmlFor="specialty-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Specialty
          </label>
          <FilterSelect
            id="specialty-filter"
            value={filterState.specialty}
            onChange={(value) => handleFilterChange('specialty', value)}
            options={availableSpecialties}
            placeholder="All Specialties"
            disabled={isLoading}
          />
        </div>

        {/* Experience Range */}
        <div>
          <label htmlFor="min-experience" className="block text-sm font-medium text-gray-700 mb-1">
            Min Experience (years)
          </label>
          <FilterInput
            id="min-experience"
            type="number"
            value={filterState.minExperience}
            onChange={(value) => handleFilterChange('minExperience', value)}
            placeholder="0"
            disabled={isLoading}
            min="0"
            max="50"
          />
        </div>

        <div>
          <label htmlFor="max-experience" className="block text-sm font-medium text-gray-700 mb-1">
            Max Experience (years)
          </label>
          <FilterInput
            id="max-experience"
            type="number"
            value={filterState.maxExperience}
            onChange={(value) => handleFilterChange('maxExperience', value)}
            placeholder="50"
            disabled={isLoading}
            min="0"
            max="50"
          />
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="md:col-span-2 lg:col-span-3">
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filterState.search && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Search: &quot;{filterState.search}&quot;
                  </span>
                )}
                {filterState.city && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    City: {filterState.city}
                  </span>
                )}
                {filterState.degree && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Degree: {filterState.degree}
                  </span>
                )}
                {filterState.specialty && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Specialty: {filterState.specialty}
                  </span>
                )}
                {(filterState.minExperience || filterState.maxExperience) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Experience: {filterState.minExperience || '0'} - {filterState.maxExperience || '∞'} years
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const AdvancedFilters = React.memo(AdvancedFiltersComponent, (prevProps, nextProps) => {
  // Custom comparison function to prevent re-renders when props haven't meaningfully changed
  return (
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.availableCities.length === nextProps.availableCities.length &&
    prevProps.availableDegrees.length === nextProps.availableDegrees.length &&
    prevProps.availableSpecialties.length === nextProps.availableSpecialties.length &&
    prevProps.availableCities.every((city, index) => city === nextProps.availableCities[index]) &&
    prevProps.availableDegrees.every((degree, index) => degree === nextProps.availableDegrees[index]) &&
    prevProps.availableSpecialties.every((specialty, index) => specialty === nextProps.availableSpecialties[index])
  );
});

AdvancedFilters.displayName = 'AdvancedFilters';
