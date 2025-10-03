# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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