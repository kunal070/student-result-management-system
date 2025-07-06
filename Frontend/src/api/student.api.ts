import axios from 'axios';
import type { Student } from '../types/student';

const API_URL = `${import.meta.env.VITE_API_URL}/students`;

export interface StudentPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
}

export const createStudent = async (student: StudentPayload): Promise<{
  success: boolean;
  message: string;
  data: any;
  statusCode: number;
  errors?: Record<string, string[]>;
}> => {
  const response = await axios.post(`${API_URL}/create`, student);
  return response.data;
};

export const fetchStudents = async (): Promise<{ students: Student[] }> => {
  const response = await axios.get(`${API_URL}/list`);
  console.log('[fetchStudents] response:', response.data);
  return { students: response.data.data };
};

export const deleteStudentAPI = async (id: string): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};  