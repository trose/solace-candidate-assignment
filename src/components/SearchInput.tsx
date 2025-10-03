"use client";

import React, { forwardRef } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Stable search input component that doesn't get recreated on every render
 * This prevents focus loss by maintaining a stable component reference
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onChange, placeholder, disabled, className }, ref) => {
    return (
      <input
        ref={ref}
        id="search-input"
        type="text"
        className={className || "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search by name, city, degree, or specialty..."}
        aria-label="Search for advocates"
        disabled={disabled}
        autoComplete="off"
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';