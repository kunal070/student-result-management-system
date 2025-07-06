import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import { createStudent } from '../api/student.api';
import { studentSchema } from '../validation/student.validation';
import { handleApiError, handleCatchError } from '../utils/errorHandlers';

interface StudentFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
}

const AddStudent: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const onSubmit = useCallback(async (data: StudentFormData) => {
    try {
      const response = await createStudent(data);

      if (response.success) {
        toast.success(response.message || 'Student created successfully!', {
          icon: '✅',
          duration: 4500,
        });
        reset();
      } else {
        handleApiError(response);
      }
    } catch (err: any) {
      handleCatchError(err);
    }
  }, [reset]);

  return (
    <div className="flex-grow w-full bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Student</h1>
            <p className="text-gray-600">Fill out the form below to add a new student</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                name="firstName"
                register={register}
                error={errors.firstName}
                required
                placeholder="Enter first name"
              />

              <InputField
                label="Last Name"
                name="lastName"
                register={register}
                error={errors.lastName}
                required
                placeholder="Enter last name"
              />
            </div>

            <InputField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              register={register}
              error={errors.dateOfBirth}
              required
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              required
              placeholder="Enter email address"
            />

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200">
                Add Student
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { AddStudent };