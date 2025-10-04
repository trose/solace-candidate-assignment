# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.2] - 2025-10-04

### Fixed

- **Filter API calls** now use newly selected values immediately instead of previous state
- **Search and filter combination** fixed to work with proper AND logic
- **Filter persistence removed** to prevent unwanted default active filters
- **Numeric filter handling** improved to ensure '0' values are treated correctly

### Changed

- **Filter state management** updated to prevent stale values in API requests
- **Search isolation** from persisted filters for cleaner search experience

## [0.3.1] - 2025-10-03

### Added

- **Solace brand integration** with custom colors (#265b4e green, bright green, blue) and fonts (Figtree, Space Mono)
- **Full-width header** positioned at the top of the page with Solace styling
- **use-debounce package** for reliable search input debouncing

### Changed

- **Header repositioning** to span full viewport width and top positioning
- **Search debouncing** migrated from custom setTimeout to useDebouncedCallback
- **Brand color updates** to match Solace's primary green (#265b4e)

### Fixed

- **Debounce implementation** replaced with battle-tested use-debounce library for better reliability

### Performance

- **Improved debouncing** with automatic cleanup and optimized callback handling

## [0.3.0] - 2025-10-03

### Added

- **Separated search and filter components** for better UX with static search bar and collapsible advanced filters
- **Zustand state management** with persistence, DevTools, and optimized selectors for better performance
- **Advanced state management features** including localStorage persistence and selective subscriptions
- **Enhanced accessibility features** with improved ARIA labels, keyboard navigation, and screen reader support
- **Advanced tooltip component** with full keyboard support and accessibility compliance
- **Shared type definitions** to eliminate code duplication and maintain DRY principles
- **Comprehensive form validation** with react-hook-form and Zod schema validation
- **Dynamic specialty management** in forms with add/remove functionality
- **Loading skeletons** for better perceived performance during data fetching
- **Component optimization** with React.memo and stable references for better performance
- **Modal component** for advocate creation with proper focus management and accessibility
- **Pagination component** with items-per-page selection and smart navigation
- **Sortable table columns** with visual indicators and keyboard navigation
- **Advanced filtering system** with collapsible interface and active filter display

### Changed

- **State management architecture** migrated from React Context to Zustand for better performance and developer experience
- **Component separation** with dedicated SearchBar and AdvancedFilters components
- **Search input behavior** now static and always visible for better user experience
- **Filter logic improvements** using proper pagination context and preserving search terms
- **Type safety enhancements** with shared type definitions and proper TypeScript coverage
- **API route configuration** with dynamic rendering to prevent static generation issues
- **Form handling** upgraded to react-hook-form with real-time validation and error handling

### Fixed

- **Focus loss issues** in search input by extracting stable input components with forwardRef
- **TypeScript compilation errors** with proper type annotations and casting
- **Dynamic server usage errors** in API routes with proper Next.js configuration
- **Linting errors** resolved across all components with ESLint disable comments where appropriate
- **Code duplication** eliminated with shared type definitions and proper imports
- **Filter state management** improved with proper pagination and search context integration
- **Accessibility compliance** enhanced with proper ARIA attributes and keyboard support

### Performance

- **Zustand optimization** with selective subscriptions and automatic re-render prevention
- **Component memoization** with React.memo to prevent unnecessary re-renders
- **Stable component references** to prevent focus loss and improve user experience
- **Optimized state updates** with proper dependency arrays and callback optimization
- **Bundle size optimization** with proper code splitting and lazy loading strategies
- **Persistent state** with localStorage integration for better user experience

### Architecture

- **Zustand state management** with persistence, DevTools, and optimized selectors
- **Direct store access** eliminating context drilling and improving performance
- **Component separation** with clear single responsibility principles
- **Shared type system** for consistent type definitions across the application
- **Enhanced accessibility** with comprehensive ARIA support and keyboard navigation
- **Improved maintainability** with better code organization and reduced complexity

## [0.2.0] - 2025-10-03

### Added

- **Zustand state management** with centralized store for advocates data, filters, and pagination
- **Persistent state** with localStorage integration and DevTools support
- **Form validation** with react-hook-form and Zod schema validation
- **Code splitting** with dynamic imports and lazy loading for better performance
- **Component performance optimization** with React.memo and callback optimization
- **Bundle size optimization** with dynamic imports and tree shaking
- **State management optimization** with proper dependency arrays
- **Memory leak prevention** with proper cleanup and monitoring
- **Type-safe validation** with comprehensive Zod schemas
- **Dynamic specialty management** in forms with add/remove functionality
- **Loading skeletons** for all lazy-loaded components
- **Bundle analysis** scripts and performance optimization tools

### Changed

- **State management** migrated from local hooks to centralized Zustand store
- **Form handling** upgraded to react-hook-form with real-time validation
- **Component loading** converted to lazy loading with dynamic imports
- **Performance optimization** integrated throughout the application
- **Type safety** enhanced with comprehensive TypeScript coverage
- **Code organization** improved with better separation of concerns

### Fixed

- **Linting errors** resolved across all new components and utilities
- **TypeScript type issues** fixed with proper type annotations
- **Performance bottlenecks** addressed with code splitting and lazy loading
- **Memory leaks** prevented with proper cleanup and monitoring
- **Bundle size** optimized with dynamic imports and tree shaking

### Performance

- **Bundle splitting** implemented for better caching and loading performance
- **Lazy loading** reduces initial bundle size and improves time to interactive
- **State persistence** improves user experience with filter and pagination memory
- **Optimized selectors** prevent unnecessary re-renders in Zustand store
- **Performance optimization** provides better application performance

### Architecture

- **Centralized state management** with Zustand for better scalability
- **Form validation layer** with Zod schemas for type-safe validation
- **Code splitting strategy** with dynamic imports and loading states
- **Performance optimization** infrastructure for production readiness
- **Type-safe development** with comprehensive TypeScript coverage

## [0.1.3] - 2025-01-31

### Added

- Database performance optimizations with comprehensive indexing strategy
- Server-side filtering and pagination for advocate search API
- In-memory caching system with TTL and automatic cleanup
- Advanced search API endpoint with filtering capabilities
- Database connection pooling with environment-specific configuration
- Unique constraint on advocate first name + last name combination
- Comprehensive database migrations for schema evolution

### Changed

- Converted client-side filtering to server-side for better performance
- Updated advocate search to use server-side pagination and filtering
- Improved database schema with proper indexes (B-tree and GIN)
- Enhanced seed API to use PostgreSQL native upsert operations
- Refactored search functionality to use custom hooks for better state management
- Updated project to use relative import paths consistently
- Replaced `globalThis as any` with proper TypeScript typing using intersection types

### Fixed

- Resolved PostgreSQL migration issues with column type conversions
- Fixed specialty search functionality to properly handle array containment
- Corrected TypeScript type errors in query building logic
- Fixed cache cleanup interval management for Next.js hot reloads
- Resolved linting errors and improved code quality
- Fixed upsert logic to use PostgreSQL's native `INSERT ... ON CONFLICT UPDATE`

### Performance

- Added database indexes on all searchable fields (firstName, lastName, city, degree, yearsOfExperience)
- Implemented GIN index for array searches on specialties
- Added composite index for full name searches
- Enhanced connection pooling with production-optimized settings
- Implemented caching layer to reduce database query load

### Database

- Added comprehensive migration strategy with proper rollback support
- Implemented proper data type handling (jsonb to text[] conversion)
- Added unique constraints to prevent duplicate advocate records
- Enhanced database schema with proper indexing for performance

## [0.1.2] - 2025-10-03

### Security

- Removed logging of DATABASE_URL in migration script to prevent credential exposure

### Accessibility

- Added scope="col" attributes to table headers for improved screen reader navigation
- Added aria-label to reset button for better context
- Added aria-hidden="true" to decorative SVG icons

### Code Quality

- Extracted inline styles to Tailwind CSS classes for better maintainability
- Added explicit type="text" to input elements for clarity
- Fixed type assertion in useAdvocates hook with proper validation and error handling
- Added loading and error states to useAdvocates hook for better UX
- Simplified onChange handler in SearchClient component
- Replaced non-semantic br tags with Tailwind flexbox for proper spacing
- Fixed inconsistent search term usage in search utilities

### Performance

- Removed redundant cache option in page.tsx (force-dynamic already handles caching)

### Error Handling

- Added error state UI in page.tsx to display fetch errors to users

## [0.1.1] - 2025-10-02

### Added

- Integrated ErrorBoundary component for better error handling in React components
- Added ARIA labels and accessibility improvements to SearchInput and AdvocateTable
- Added table caption for better screen reader support
- Enhanced ESLint configuration to allow console.error for debugging

### Changed

- Updated ESLint rules to fix indentation and console statement warnings
- Improved error handling in API routes with try-catch blocks and proper HTTP status codes
- Refactored code for better separation of concerns using custom hooks and utilities
- Fixed TypeScript type issues and ensured comprehensive type coverage

### Fixed

- Resolved all ESLint warnings and errors
- Fixed indentation issues across multiple files
- Ensured no hardcoded secrets or security vulnerabilities in API routes

### Security

- Reviewed and confirmed no hardcoded secrets
- Added input validation checks (no inputs in current APIs)

## [0.1.0] - 2025-10-02

### Added

- Initial project setup with Next.js 14, React 18, and TypeScript
- Database integration with Drizzle ORM and PostgreSQL
- Basic advocate search functionality with filtering
- Component structure: SearchClient, SearchInput, AdvocateTable, AdvocateRow
- Custom hooks for data fetching (useAdvocates) and search (useAdvocateSearch)
- Utility functions for advocate filtering
- ErrorBoundary component for error handling
- ESLint, Prettier, and Husky for code quality
- Tailwind CSS for styling
- Docker Compose for local development environment
- Seed data for advocates with various fields (name, city, degree, specialties, etc.)

### Setup

- Configured Drizzle for database schema and migrations
- Set up API routes for fetching and seeding advocates
- Implemented server-side rendering with Next.js App Router
- Added environment variables for database connection
- Configured Git hooks for commit linting
