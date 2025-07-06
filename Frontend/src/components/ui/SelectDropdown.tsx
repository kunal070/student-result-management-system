import React from 'react';
import type { UseFormRegister, FieldError } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  options: Option[];
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  name,
  register,
  options,
  error,
  placeholder = 'Select an option',
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        {...register(name)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};
