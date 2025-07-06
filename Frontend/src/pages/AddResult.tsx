import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

import { SelectDropdown } from '../components/ui/SelectDropdown';
import { Button } from '../components/ui/Button';

import { fetchStudents } from '../api/student.api';
import { fetchCourses } from '../api/course.api';
import { createResult } from '../api/result.api';

import type { Student } from '../types/student';
import type { Course } from '../types/course';

import { resultSchema, type ResultSchema } from '../validation/result.validation';

const AddResult: React.FC = () => {
  const {
    data: studentData,
    isError: errorStudents,
  } = useQuery<{ students: Student[] }, Error>({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  const {
    data: courseData,
    isError: errorCourses,
  } = useQuery<{ data: Course[] }, Error>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
  });

  const onSubmit = async (data: ResultSchema) => {
    try {
      const response = await createResult(data);

      if (response.success) {
        toast.success('Result added successfully!');
        reset();
      } else {
        toast.error(response.message || 'Failed to add result.');
      }
    } catch (error) {
      console.error('Error adding result:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  const studentOptions =
    studentData?.students.map((student) => ({
      value: student.id,
      label: `${student.firstName} ${student.lastName}`,
    })) ?? [];

  const courseOptions =
    courseData?.data.map((course) => ({
      value: course.id,
      label: course.courseName,
    })) ?? [];

  const gradeOptions = ['A', 'B', 'C', 'D', 'E', 'F'].map((grade) => ({
    value: grade,
    label: grade,
  }));

  if (errorStudents || errorCourses) {
    return (
      <p className="text-red-500">
        Failed to load dropdown data. Please try again later.
      </p>
    );
  }

  return (
    <div className="flex-grow w-full bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Add New Result</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <SelectDropdown
              label="Student Name"
              name="studentId"
              register={register}
              options={studentOptions}
              error={errors.studentId}
              placeholder="Select a student"
              required
            />

            <SelectDropdown
              label="Course Name"
              name="courseId"
              register={register}
              options={courseOptions}
              error={errors.courseId}
              placeholder="Select a course"
              required
            />

            <SelectDropdown
              label="Score"
              name="score"
              register={register}
              options={gradeOptions}
              error={errors.score}
              placeholder="Select a grade"
              required
            />

            <Button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700">
              Add Result
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export { AddResult };
