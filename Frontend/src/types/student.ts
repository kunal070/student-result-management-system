export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  enrollmentDate?: string;
  status?: 'active' | 'inactive' | 'pending';
  coursesCount?: number;
}
