# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [0.1.2] - 2024-10-03

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

## [0.1.1] - 2024-10-02

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

## [0.1.0] - 2024-09-01

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