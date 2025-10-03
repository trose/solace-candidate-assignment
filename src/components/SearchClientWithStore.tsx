"use client";

import { useCallback, useMemo, useEffect } from "react";
import { useAdvocates, useAdvocatesLoading, useAdvocatesError, useAdvocatesPagination, useAdvocatesFilters, useAdvocatesActions } from "../stores/advocateStore";
import { AdvancedFilters } from "./AdvancedFilters";
import { AdvocateTable } from "./AdvocateTable";
import { Pagination } from "./Pagination";
import { SkeletonFilters } from "./SkeletonFilters";
import { SkeletonTable } from "./SkeletonTable";

/**
 * Renders an advanced search UI and advocates table powered by Zustand store.
 *
 * This component uses centralized state management with Zustand for better
 * performance, state persistence, and separation of concerns. It provides
 * comprehensive filtering options including search, city, degree, experience
 * range, and specialty filters.
 *
 * @returns The component's React element containing the advanced filters, status messages, and advocate table.
 */
export function SearchClientWithStore() {
  // Zustand store selectors
  const advocates = useAdvocates();
  const loading = useAdvocatesLoading();
  const error = useAdvocatesError();
  const pagination = useAdvocatesPagination();
  const filters = useAdvocatesFilters();
  const actions = useAdvocatesActions();

  // Extract unique values for filter options
  const availableCities = useMemo(() =>
    Array.from(new Set(advocates.map(advocate => advocate.city))).sort(),
  [advocates]
  );

  const availableDegrees = useMemo(() =>
    Array.from(new Set(advocates.map(advocate => advocate.degree))).sort(),
  [advocates]
  );

  const availableSpecialties = useMemo(() =>
    Array.from(new Set(advocates.flatMap(advocate => advocate.specialties))).sort(),
  [advocates]
  );

  // Load all advocates on mount
  useEffect(() => {
    actions.loadAllAdvocates();
  }, [actions]);

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    // Update filters in store
    actions.setFilters(newFilters);

    // Reset to first page when filters change
    actions.setCurrentPage(1);

    // Convert empty strings to undefined for the API
    const searchParams = {
      search: newFilters.search || undefined,
      city: newFilters.city || undefined,
      degree: newFilters.degree || undefined,
      minExperience: newFilters.minExperience || undefined,
      maxExperience: newFilters.maxExperience || undefined,
      specialty: newFilters.specialty || undefined,
      limit: pagination.itemsPerPage,
      offset: 0, // Always start from first page when filters change
    };

    // Check if any filters are active
    const hasActiveFilters = Object.values(searchParams).some(value => value !== undefined);

    if (hasActiveFilters) {
      actions.searchAdvocates(searchParams);
    } else {
      actions.loadAllAdvocates();
    }
  }, [actions, pagination.itemsPerPage]);

  const handleReset = useCallback(() => {
    actions.resetFilters();
    actions.setCurrentPage(1);
    actions.loadAllAdvocates();
  }, [actions]);

  const handlePageChange = useCallback((page: number) => {
    actions.setCurrentPage(page);

    // Trigger search with new pagination
    const offset = (page - 1) * pagination.itemsPerPage;

    // Use current filters with new pagination
    const searchParams = {
      search: filters.search || undefined,
      city: filters.city || undefined,
      degree: filters.degree || undefined,
      minExperience: filters.minExperience || undefined,
      maxExperience: filters.maxExperience || undefined,
      specialty: filters.specialty || undefined,
      limit: pagination.itemsPerPage,
      offset,
    };

    // Check if any filters are active
    const hasActiveFilters = Object.values(searchParams).some(value => value !== undefined);

    if (hasActiveFilters) {
      actions.searchAdvocates(searchParams);
    } else {
      actions.loadAllAdvocates();
    }
  }, [actions, pagination.itemsPerPage, filters]);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    actions.setItemsPerPage(newItemsPerPage);
    actions.setCurrentPage(1);

    // Trigger search with new items per page
    const searchParams = {
      search: filters.search || undefined,
      city: filters.city || undefined,
      degree: filters.degree || undefined,
      minExperience: filters.minExperience || undefined,
      maxExperience: filters.maxExperience || undefined,
      specialty: filters.specialty || undefined,
      limit: newItemsPerPage,
      offset: 0,
    };

    // Check if any filters are active
    const hasActiveFilters = Object.values(searchParams).some(value => value !== undefined);

    if (hasActiveFilters) {
      actions.searchAdvocates(searchParams);
    } else {
      actions.loadAllAdvocates();
    }
  }, [actions, filters]);

  return (
    <div className="flex flex-col gap-6">
      {loading && advocates.length === 0 ? (
        <SkeletonFilters />
      ) : (
        <AdvancedFilters
          onFiltersChange={handleFiltersChange}
          onReset={handleReset}
          availableCities={availableCities}
          availableDegrees={availableDegrees}
          availableSpecialties={availableSpecialties}
          isLoading={loading}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {loading && advocates.length === 0 ? (
        <SkeletonTable rows={5} columns={7} />
      ) : (
        <AdvocateTable advocates={advocates} />
      )}

      {!loading && advocates.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          isLoading={loading}
        />
      )}
    </div>
  );
}
