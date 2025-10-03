import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { advocateFormSchema, type AdvocateFormInput } from '../schemas/advocateSchemas';

/**
 * Hook for managing advocate form state with validation
 * Uses react-hook-form with Zod schema validation
 */
export function useAdvocateForm(defaultValues?: Partial<AdvocateFormInput>) {
  const form = useForm<AdvocateFormInput>({
    resolver: zodResolver(advocateFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      city: '',
      degree: '',
      specialties: [],
      yearsOfExperience: 0,
      phoneNumber: '',
      ...defaultValues,
    },
    mode: 'onChange', // Validate on change for better UX
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    reset,
    setValue,
    watch,
    getValues,
    setError,
    clearErrors,
  } = form;

  /**
   * Add a specialty to the specialties array
   */
  const addSpecialty = (specialty: string) => {
    const currentSpecialties = getValues('specialties');
    if (!currentSpecialties.includes(specialty)) {
      setValue('specialties', [...currentSpecialties, specialty], { shouldValidate: true });
    }
  };

  /**
   * Remove a specialty from the specialties array
   */
  const removeSpecialty = (specialty: string) => {
    const currentSpecialties = getValues('specialties');
    setValue('specialties', currentSpecialties.filter(s => s !== specialty), { shouldValidate: true });
  };

  /**
   * Clear all specialties
   */
  const clearSpecialties = () => {
    setValue('specialties', [], { shouldValidate: true });
  };

  /**
   * Set a field value and trigger validation
   */
  const setFieldValue = (field: keyof AdvocateFormInput, value: string | number | string[]) => {
    setValue(field, value, { shouldValidate: true });
  };

  /**
   * Reset form to default values
   */
  const resetForm = (newDefaultValues?: Partial<AdvocateFormInput>) => {
    reset(newDefaultValues || defaultValues);
  };

  /**
   * Set multiple field errors
   */
  const setFieldErrors = (errors: Record<string, string>) => {
    Object.entries(errors).forEach(([field, message]) => {
      setError(field as keyof AdvocateFormInput, { type: 'manual', message });
    });
  };

  /**
   * Clear all field errors
   */
  const clearFieldErrors = () => {
    clearErrors();
  };

  /**
   * Get form data as a plain object
   */
  const getFormData = () => getValues();

  /**
   * Check if a specific field has an error
   */
  const hasFieldError = (field: keyof AdvocateFormInput) => {
    return !!errors[field];
  };

  /**
   * Get error message for a specific field
   */
  const getFieldError = (field: keyof AdvocateFormInput) => {
    return errors[field]?.message;
  };

  /**
   * Check if form is ready for submission
   */
  const isReadyToSubmit = isValid && isDirty && !isSubmitting;

  return {
    // Form methods
    register,
    handleSubmit,
    reset: resetForm,
    setValue: setFieldValue,
    watch,
    getValues: getFormData,
    setError,
    clearErrors: clearFieldErrors,

    // Form state
    errors,
    isValid,
    isDirty,
    isSubmitting,
    isReadyToSubmit,

    // Custom methods
    addSpecialty,
    removeSpecialty,
    clearSpecialties,
    setFieldErrors,
    clearFieldErrors,
    hasFieldError,
    getFieldError,

    // Form instance for advanced usage
    form,
  };
}
