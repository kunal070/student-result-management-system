import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { fetchResults, deleteResultAPI } from '../api/result.api';
import { getResultTableColumns } from '../components/table/resultColumns';
import { GenericTable } from '../components/table/GenericTable';
import type { ResultWithRelations } from '../types/result';

const ResultList: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery<{ results: ResultWithRelations[] }, Error>({
    queryKey: ['results'],
    queryFn: fetchResults,
  });

  const results = data?.results ?? [];

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await deleteResultAPI(id);
        toast.success('Result deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['results'] });
      } catch (error) {
        toast.error('Failed to delete result.');
      }
    }
  };

  if (isError) {
    return <p className="text-red-500">Failed to load results. Please try again.</p>;
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Results List</h1>

      <div className="bg-white rounded-lg shadow-md">
        <GenericTable<ResultWithRelations>
          data={results}
          columns={getResultTableColumns({ onDelete: (res) => handleDelete(res.id) })}
          isLoading={isLoading}
          itemsPerPage={5}
        />
      </div>
    </div>
  );
};

export {ResultList};