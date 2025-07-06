import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/results`;

export const createResult = async (data: {
  studentId: string;
  courseId: string;
  score: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}) => {
  const payload = { ...data, grade: data.score };
  const response = await axios.post(`${API_URL}/create`, payload);
  return response.data;
};

export const fetchResults = async () => {
  const response = await axios.get(`${API_URL}/list`);
  return response.data;
};

export const deleteResultAPI = async (id: string) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};
