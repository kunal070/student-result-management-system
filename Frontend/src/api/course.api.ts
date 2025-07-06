import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/courses`;

export interface CoursePayload {
  courseName: string;
}

export const createCourse = async (course: CoursePayload) => {
  const response = await axios.post(`${API_URL}/create`, course);
  return response.data; 
};

export const fetchCourses = async () => {
  const response = await axios.get(`${API_URL}/list`);
  return response.data; 
};

export const deleteCourse = async (id: string) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data; 
};

export const getCourseById = async (id: string) => {
  const response = await axios.get(`${API_URL}/list/${id}`);
  return response.data; 
};
