"use client";

import { useState, useEffect } from "react";

interface FilterOptions {
  search: string;
  city: string;
  degree: string;
  minExperience: string;
  maxExperience: string;
  specialty: string;
}

interface AdvancedFiltersProps {
  // eslint-disable-next-line no-unused-vars
  onFiltersChange: (filterOptions: FilterOptions) => void;
  onReset: () => void;
  availableCities: string[];
  availableDegrees: string[];
  availableSpecialties: string[];
  isLoading?: boolean;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  onReset,
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

  useEffect(() => {
    onFiltersChange(filterState);
  }, [filterState, onFiltersChange]);

  const handleFilterChange = (field: keyof FilterOptions, value: string) => {
    setFilterState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setFilterState({
      search: '',
      city: '',
      degree: '',
      minExperience: '',
      maxExperience: '',
      specialty: ''
    });
    onReset();
  };

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
        <input
          id="search-input"
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filterState.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Search by name, city, degree, or specialty..."
          aria-label="Search for advocates"
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
          <select
            id="city-filter"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterState.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            disabled={isLoading}
          >
            <option value="">All Cities</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Degree Filter */}
        <div>
          <label htmlFor="degree-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Degree
          </label>
          <select
            id="degree-filter"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterState.degree}
            onChange={(e) => handleFilterChange('degree', e.target.value)}
            disabled={isLoading}
          >
            <option value="">All Degrees</option>
            {availableDegrees.map(degree => (
              <option key={degree} value={degree}>{degree}</option>
            ))}
          </select>
        </div>

        {/* Specialty Filter */}
        <div>
          <label htmlFor="specialty-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Specialty
          </label>
          <select
            id="specialty-filter"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterState.specialty}
            onChange={(e) => handleFilterChange('specialty', e.target.value)}
            disabled={isLoading}
          >
            <option value="">All Specialties</option>
            {availableSpecialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>

        {/* Experience Range */}
        <div>
          <label htmlFor="min-experience" className="block text-sm font-medium text-gray-700 mb-1">
            Min Experience (years)
          </label>
          <input
            id="min-experience"
            type="number"
            min="0"
            max="50"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterState.minExperience}
            onChange={(e) => handleFilterChange('minExperience', e.target.value)}
            placeholder="0"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="max-experience" className="block text-sm font-medium text-gray-700 mb-1">
            Max Experience (years)
          </label>
          <input
            id="max-experience"
            type="number"
            min="0"
            max="50"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterState.maxExperience}
            onChange={(e) => handleFilterChange('maxExperience', e.target.value)}
            placeholder="50"
            disabled={isLoading}
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
