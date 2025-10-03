"use client";

import React, { forwardRef } from 'react';

interface FilterInputProps {
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  min?: string;
  max?: string;
}

/**
 * Stable filter input component that doesn't get recreated on every render
 * This prevents focus loss by maintaining stable component references
 */
export const FilterInput = forwardRef<HTMLInputElement, FilterInputProps>(
  ({ id, type = "text", value, onChange, placeholder, disabled, className, min, max }, ref) => {
    return (
      <input
        ref={ref}
        id={id}
        type={type}
        className={className || "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        autoComplete="off"
      />
    );
  }
);

FilterInput.displayName = 'FilterInput';
