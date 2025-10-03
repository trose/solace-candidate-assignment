"use client";

import React, { forwardRef } from 'react';

interface FilterSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Stable filter select component that doesn't get recreated on every render
 * This prevents focus loss by maintaining stable component references
 */
export const FilterSelect = forwardRef<HTMLSelectElement, FilterSelectProps>(
  ({ id, onChange, options, placeholder, disabled, className }, ref) => {
    return (
      <select
        ref={ref}
        id={id}
        className={className || "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">{placeholder || "All"}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }
);

FilterSelect.displayName = 'FilterSelect';
