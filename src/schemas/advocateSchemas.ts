import { z } from 'zod';

/**
 * Schema for advocate search filters
 */
export const advocateSearchSchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  degree: z.string().optional(),
  minExperience: z.string().optional(),
  maxExperience: z.string().optional(),
  specialty: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

/**
 * Schema for advocate form data
 */
export const advocateFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  city: z.string().min(1, 'City is required').max(100, 'City must be less than 100 characters'),
  degree: z.string().min(1, 'Degree is required').max(100, 'Degree must be less than 100 characters'),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  yearsOfExperience: z.number().min(0, 'Years of experience must be non-negative').max(50, 'Years of experience must be less than 50'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be less than 15 digits'),
});

/**
 * Schema for pagination parameters
 */
export const paginationSchema = z.object({
  currentPage: z.number().min(1, 'Current page must be at least 1'),
  itemsPerPage: z.number().min(1, 'Items per page must be at least 1').max(100, 'Items per page must be less than 100'),
  totalItems: z.number().min(0, 'Total items must be non-negative'),
});

/**
 * Schema for filter state
 */
export const filterStateSchema = z.object({
  search: z.string(),
  city: z.string(),
  degree: z.string(),
  minExperience: z.string(),
  maxExperience: z.string(),
  specialty: z.string(),
});

/**
 * Schema for API response validation
 */
export const advocateResponseSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  city: z.string(),
  degree: z.string(),
  specialties: z.array(z.string()),
  yearsOfExperience: z.number(),
  phoneNumber: z.number(),
  createdAt: z.string(),
});

/**
 * Schema for search result response
 */
export const searchResultSchema = z.object({
  advocates: z.array(advocateResponseSchema),
  total: z.number(),
  limit: z.number().nullable().optional(),
  offset: z.number().nullable().optional(),
});

/**
 * Type exports for TypeScript
 */
export type AdvocateSearchInput = z.infer<typeof advocateSearchSchema>;
export type AdvocateFormInput = z.infer<typeof advocateFormSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type FilterStateInput = z.infer<typeof filterStateSchema>;
export type AdvocateResponse = z.infer<typeof advocateResponseSchema>;
export type SearchResultResponse = z.infer<typeof searchResultSchema>;

/**
 * Validation helper functions
 */
export const validateAdvocateSearch = (data: unknown) => {
  return advocateSearchSchema.safeParse(data);
};

export const validateAdvocateForm = (data: unknown) => {
  return advocateFormSchema.safeParse(data);
};

export const validatePagination = (data: unknown) => {
  return paginationSchema.safeParse(data);
};

export const validateFilterState = (data: unknown) => {
  return filterStateSchema.safeParse(data);
};

export const validateAdvocateResponse = (data: unknown) => {
  return advocateResponseSchema.safeParse(data);
};

export const validateSearchResult = (data: unknown) => {
  return searchResultSchema.safeParse(data);
};
