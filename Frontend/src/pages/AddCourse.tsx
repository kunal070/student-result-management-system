import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';

import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';

import { courseSchema } from '../validation/course.validation';
import type { CourseSchema } from '../validation/course.validation';

import { createCourse } from '../api/course.api';
import { handleApiError, handleCatchError } from '../utils/errorHandlers';

const AddCourse: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),
  });

  const onSubmit = async (data: CourseSchema) => {
    try {
      const response = await createCourse(data);

      if (response.success) {
        toast.success(response.message || 'Course added successfully!');
        reset();
      } else {
        handleApiError(response);
      }
    } catch (error) {
      handleCatchError(error);
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 absolute left-[58%] top-[22%] transform -translate-x-1/2">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Add New Course</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          label="Course Name"
          name="courseName"
          register={register}
          error={errors.courseName}
          placeholder="Enter course name"
          required
        />

        <Button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700">
          Add Course
        </Button>
      </form>
    </div>
  );
};

export { AddCourse };
