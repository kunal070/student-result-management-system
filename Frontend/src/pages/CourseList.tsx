import React from 'react';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCourses, deleteCourse } from '../api/course.api';
import type { Course } from '../types/course';
import { GenericTable } from '../components/table/GenericTable';
import { getCourseTableColumns } from '../components/table/getCourseTableColumns';

const CourseList: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery<{ data: Course[] }, Error>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  const courses = data?.data ?? [];

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        toast.success('Course deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['courses'] });
      } catch (error) {
        toast.error('Failed to delete course.');
      }
    }
  };

  if (isError) return <p className="text-red-500">Error loading courses.</p>;

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Course List</h1>

      <div className="bg-white rounded-lg shadow-md">
        <GenericTable<Course>
          data={courses}
          columns={getCourseTableColumns({ onDelete: (course) => handleDelete(course.id) })}
          isLoading={isLoading}
          itemsPerPage={5}
        />
      </div>
    </div>
  );
};

export default CourseList;
