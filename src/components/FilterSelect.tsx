"use client";

/* eslint-disable no-unused-vars */
import React, { forwardRef } from 'react';

interface FilterSelectProps {
  id: string;
  // eslint-disable-next-line no-unused-vars
  value: string; // Required for controlled select
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
  ({ id, value, onChange, options, placeholder, disabled, className }, ref) => {
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
