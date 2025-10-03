"use client";

import React, { useState, useCallback, useRef } from "react";
import { useAdvocatesFilters, useAdvocatesPagination, useAdvocateStore } from "../stores/advocateStore";
import { FilterInput } from "./FilterInput";
import { FilterSelect } from "./FilterSelect";

interface FilterOptions {
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
    city: '',
    degree: '',
    minExperience: '',
    maxExperience: '',
    specialty: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const currentFiltersRef = useRef<FilterOptions>({
    city: '',
    degree: '',
    minExperience: '',
    maxExperience: '',
    specialty: ''
  });

  // Use Zustand store
  const filters = useAdvocatesFilters();
  const pagination = useAdvocatesPagination();
  const setFilters = useAdvocateStore((state) => state.setFilters);
  const setPagination = useAdvocateStore((state) => state.setPagination);
  const searchAdvocates = useAdvocateStore((state) => state.searchAdvocates);
  const loadAllAdvocates = useAdvocateStore((state) => state.loadAllAdvocates);
  const resetFilters = useAdvocateStore((state) => state.resetFilters);

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

    // Update store and search immediately for filters (no debouncing needed)
    setFilters({ [field]: value });
    setPagination({ currentPage: 1 });

    const searchParams = {
      search: filters.search || undefined, // Include current search term
      city: currentFiltersRef.current.city || undefined,
      degree: currentFiltersRef.current.degree || undefined,
      minExperience: currentFiltersRef.current.minExperience || undefined,
      maxExperience: currentFiltersRef.current.maxExperience || undefined,
      specialty: currentFiltersRef.current.specialty || undefined,
      limit: pagination.itemsPerPage,
      offset: 0, // Reset to first page when filters change
    };

    // Check if any filters are active (exclude limit/offset from check)
    const hasActiveFilters = Boolean(
      searchParams.search ||
      searchParams.city ||
      searchParams.degree ||
      searchParams.minExperience ||
      searchParams.maxExperience ||
      searchParams.specialty
    );

    if (hasActiveFilters) {
      searchAdvocates(searchParams);
    } else {
      loadAllAdvocates();
    }
  }, [setFilters, setPagination, searchAdvocates, loadAllAdvocates, pagination.itemsPerPage, filters.search]);

  const handleReset = useCallback(() => {
    const resetState = {
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
    setPagination({ currentPage: 1 });
    loadAllAdvocates();
  }, [resetFilters, setPagination, loadAllAdvocates]);

  const hasActiveFilters = Object.values(filterState).some(value => value.trim() !== '');

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Advanced Filters</h3>
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
              aria-label="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>
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