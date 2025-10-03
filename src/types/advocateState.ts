/**
 * Shared type definitions for advocate state management
 * Used across contexts and components to ensure consistency
 */

export interface FilterState {
  search: string;
  city: string;
  degree: string;
  minExperience: string;
  maxExperience: string;
  specialty: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}
