"use client";

import React, { useState } from 'react';
import { useAdvocateForm } from '../hooks/useAdvocateForm';
import { AdvocateFormInput } from '../schemas/advocateSchemas';

interface AdvocateFormProps {
  onSubmit: (data: AdvocateFormInput) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<AdvocateFormInput>;
  isLoading?: boolean;
}

/**
 * Form component for creating/editing advocates with validation
 * Uses react-hook-form with Zod schema validation
 */
export function AdvocateForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false
}: AdvocateFormProps) {
  const {
    register,
    handleSubmit,
    addSpecialty,
    removeSpecialty,
    hasFieldError,
    getFieldError,
    watch,
  } = useAdvocateForm(initialData);

  const [newSpecialty, setNewSpecialty] = useState('');
  const watchedSpecialties = watch('specialties');

  const handleFormSubmit = async (formData: AdvocateFormInput) => {
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !watchedSpecialties.includes(newSpecialty.trim())) {
      addSpecialty(newSpecialty.trim());
      setNewSpecialty('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSpecialty();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            {...register('firstName')}
            type="text"
            id="firstName"
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              hasFieldError('firstName') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter first name"
            disabled={isLoading || isSubmitting}
          />
          {hasFieldError('firstName') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('firstName')}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            {...register('lastName')}
            type="text"
            id="lastName"
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              hasFieldError('lastName') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter last name"
            disabled={isLoading || isSubmitting}
          />
          {hasFieldError('lastName') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('lastName')}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            {...register('city')}
            type="text"
            id="city"
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              hasFieldError('city') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter city"
            disabled={isLoading || isSubmitting}
          />
          {hasFieldError('city') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('city')}</p>
          )}
        </div>

        {/* Degree */}
        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
            Degree *
          </label>
          <input
            {...register('degree')}
            type="text"
            id="degree"
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              hasFieldError('degree') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter degree"
            disabled={isLoading || isSubmitting}
          />
          {hasFieldError('degree') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('degree')}</p>
          )}
        </div>

        {/* Years of Experience */}
        <div>
          <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience *
          </label>
          <input
            {...register('yearsOfExperience', { valueAsNumber: true })}
            type="number"
            id="yearsOfExperience"
            min="0"
            max="50"
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              hasFieldError('yearsOfExperience') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter years of experience"
            disabled={isLoading || isSubmitting}
          />
          {hasFieldError('yearsOfExperience') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('yearsOfExperience')}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            {...register('phoneNumber')}
            type="tel"
            id="phoneNumber"
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              hasFieldError('phoneNumber') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter phone number"
            disabled={isLoading || isSubmitting}
          />
          {hasFieldError('phoneNumber') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('phoneNumber')}</p>
          )}
        </div>
      </div>

      {/* Specialties */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specialties *
        </label>

        {/* Add Specialty Input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a specialty"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading || isSubmitting}
          />
          <button
            type="button"
            onClick={handleAddSpecialty}
            disabled={!newSpecialty.trim() || isLoading || isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>

        {/* Current Specialties */}
        <div className="space-y-2">
          {watchedSpecialties.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {watchedSpecialties.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {specialty}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(specialty)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    disabled={isLoading || isSubmitting}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No specialties added yet</p>
          )}
        </div>

        {hasFieldError('specialties') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('specialties')}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            disabled={isLoading || isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!isReadyToSubmit || isLoading || isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Advocate'}
        </button>
      </div>
    </form>
  );
}
