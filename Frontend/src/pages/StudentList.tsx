import React from 'react';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchStudents, deleteStudentAPI } from '../api/student.api';
import type { Student } from '../types/student';
import { GenericTable } from '../components/table/GenericTable';
import { getStudentTableColumns } from '../components/table/studentColumns';

const StudentList: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery<{ students: Student[] }, Error>({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  const students = data?.students ?? [];

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudentAPI(id);
        toast.success('Student deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['students'] });
      } catch (error) {
        toast.error('Failed to delete student.');
      }
    }
  };

  if (isError) return <p className="text-red-500">Error loading students.</p>;

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Student List</h1>

      <div className="bg-white rounded-lg shadow-md">
        <GenericTable<Student>
          data={students}
          columns={getStudentTableColumns({ onDelete: (student) => handleDelete(student.id) })}
          isLoading={isLoading}
          itemsPerPage={5}
        />
      </div>
    </div>
  );
};

export default StudentList;
