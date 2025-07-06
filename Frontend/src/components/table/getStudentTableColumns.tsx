import type { Student } from '../../types/student';
import { Mail, Calendar, Trash2 } from 'lucide-react';
import ActionButton from './ActionButtons';

export const getStudentTableColumns = ({
  onDelete,
}: {
  onDelete?: (student: Student) => void;
}) => [
  {
    key: 'firstName',
    label: 'Name',
    sortable: true,
    render: (_: any, row: Student) => (
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
          {row.firstName[0]}
          {row.lastName[0]}
        </div>
        <div className="font-medium text-gray-900">
          {row.firstName} {row.lastName}
        </div>
      </div>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    render: (value: string) => (
      <div className="flex items-center space-x-2">
        <Mail className="w-4 h-4 text-gray-400" />
        <span>{value}</span>
      </div>
    ),
  },
  {
    key: 'dateOfBirth',
    label: 'Date of Birth',
    sortable: true,
    render: (value: string) => (
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span>{new Date(value).toLocaleDateString()}</span>
      </div>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (_: any, row: Student) => (
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
