import type { Course } from '../../types/course';
import { Trash2 } from 'lucide-react';
import ActionButton from './ActionButtons';

export const getCourseTableColumns = ({
  onDelete,
}: {
  onDelete?: (course: Course) => void;
}) => [
  {
    key: 'courseName',
    label: 'Course Name',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (_: any, row: Course) => (
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
