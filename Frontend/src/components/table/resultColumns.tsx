import { type ResultWithRelations } from '../../types/result';
import { Trash2 } from 'lucide-react';
import {ActionButton} from './ActionButtons';

export const getResultTableColumns = ({
  onDelete,
}: {
  onDelete?: (result: ResultWithRelations) => void;
}) => [
  {
    key: 'courseName',
    label: 'Course',
    render: (_: any, row: ResultWithRelations) => row.course.courseName,
  },  
  {
    key: 'studentName',
    label: 'Student',        
    render: (_: any, row: ResultWithRelations) =>
      `${row.student.firstName} ${row.student.lastName}`
    },
  {
    key: 'score',
    label: 'Score',
    render: (_: any, row: ResultWithRelations) => {
      const grade = row.grade; 
      return (
        <span className={`px-2 py-1 rounded text-sm font-semibold ${getGradeColor(grade)}`}>
          {grade}
        </span>
      );
    },
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (_: any, row: ResultWithRelations) => (
      <div className="flex items-center space-x-1">
        {onDelete && (
          <ActionButton
            onClick={() => onDelete(row)}
            icon={<Trash2 className="w-4 h-4" />}
            label="Delete"
            variant="danger"
          />
        )}
      </div>
    ),
  },
];

const getGradeColor = (grade: string): string => {
  switch (grade) {
    case 'A':
      return 'bg-green-100 text-green-800';
    case 'B':
      return 'bg-blue-100 text-blue-800';
    case 'C':
      return 'bg-yellow-100 text-yellow-800';
    case 'D':
      return 'bg-orange-100 text-orange-800';
    case 'E':
    case 'F':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};