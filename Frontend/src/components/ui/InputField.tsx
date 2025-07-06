import React from 'react';
import type { UseFormRegister, FieldError } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'date';
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  register,
  error,
  placeholder,
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};
