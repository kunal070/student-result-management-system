export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface Result {
  id: string;
  studentId: string;
  courseId: string;
  grade: Grade;  
  createdAt: string;
  updatedAt: string;
}

export interface ResultWithRelations extends Result {
  student: {
    firstName: string;
    lastName: string;
    fullName?: string; 
  };
  course: {
    courseName: string;
  };
}


export interface ResultResponse {
  success: boolean;
  message: string;
  data: ResultWithRelations[] | ResultWithRelations | null;
  statusCode: number;
}

export interface CreateResultInput {
  studentId: string;
  courseId: string;
  grade: Grade;
}