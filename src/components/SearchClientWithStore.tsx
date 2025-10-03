"use client";

import { useCallback, useMemo, useEffect, useState } from "react";
import { useAdvocates, useAdvocatesLoading, useAdvocatesError, useAdvocatesPagination, useAdvocatesFilters, useAdvocateStore } from "../stores/advocateStore";
import { AdvancedFilters } from "./AdvancedFilters";
import { AdvocateTable } from "./AdvocateTable";
import { Pagination } from "./Pagination";
import { SkeletonFilters } from "./SkeletonFilters";
import { SkeletonTable } from "./SkeletonTable";
import { Modal } from "./Modal";
import { Tooltip } from "./Tooltip";
import { AdvocateForm } from "./AdvocateForm";
import { AdvocateFormInput } from "../schemas/advocateSchemas";

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
  const { setFilters, setCurrentPage, searchAdvocates, loadAllAdvocates, resetFilters, setItemsPerPage } = useAdvocateStore();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    loadAllAdvocates();
  }, [loadAllAdvocates]);

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    // Update filters in store
    setFilters(newFilters);

    // Reset to first page when filters change
    setCurrentPage(1);

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
      searchAdvocates(searchParams);
    } else {
      loadAllAdvocates();
    }
  }, [setFilters, setCurrentPage, searchAdvocates, loadAllAdvocates, pagination.itemsPerPage]);

  const handleReset = useCallback(() => {
    resetFilters();
    setCurrentPage(1);
    loadAllAdvocates();
  }, [resetFilters, setCurrentPage, loadAllAdvocates]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);

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
      searchAdvocates(searchParams);
    } else {
      loadAllAdvocates();
    }
  }, [setCurrentPage, searchAdvocates, loadAllAdvocates, pagination.itemsPerPage, filters]);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);

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
      searchAdvocates(searchParams);
    } else {
      loadAllAdvocates();
    }
  }, [setItemsPerPage, setCurrentPage, searchAdvocates, loadAllAdvocates, filters]);

  const handleAdvocateSubmit = useCallback(async (data: AdvocateFormInput) => {
    try {
      // Here you would typically make an API call to create the advocate
      // For now, we'll just close the modal and refresh the data
      console.log('New advocate data:', data);
      setIsModalOpen(false);
      // Refresh the advocates list
      loadAllAdvocates();
    } catch (error) {
      console.error('Error creating advocate:', error);
    }
  }, [loadAllAdvocates]);

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

      {/* Add Advocate Button */}
      <div className="flex justify-end">
        <Tooltip content="New Advocate" position="left">
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Add new advocate"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </Tooltip>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Advocate"
        size="lg"
      >
        <AdvocateForm
          onSubmit={handleAdvocateSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={loading}
        />
      </Modal>
    </div>
  );
}
