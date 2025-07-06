import { expect } from 'vitest';

export const assertApiResponse = (response: any, expectedStatus: number) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('success');
  expect(response.body).toHaveProperty('message');
  expect(response.body).toHaveProperty('statusCode', expectedStatus);
};

export const assertSuccessResponse = (response: any, expectedStatus: number = 200) => {
  assertApiResponse(response, expectedStatus);
  expect(response.body.success).toBe(true);
  expect(response.body.data).toBeDefined();
};

export const assertErrorResponse = (response: any, expectedStatus: number) => {
  assertApiResponse(response, expectedStatus);
  expect(response.body.success).toBe(false);
  expect(response.body.data).toBeNull();
};

export const assertValidationError = (response: any) => {
  assertErrorResponse(response, 400);
  expect(response.body.message).toBe('Validation failed');
  expect(response.body.errors).toBeDefined();
  expect(typeof response.body.errors).toBe('object');
};

// Student-specific assertions
export const assertStudentShape = (student: any) => {
  expect(student).toHaveProperty('id');
  expect(student).toHaveProperty('firstName');
  expect(student).toHaveProperty('lastName');
  expect(student).toHaveProperty('email');
  expect(student).toHaveProperty('dateOfBirth');
  expect(student).toHaveProperty('createdAt');
  expect(student).toHaveProperty('updatedAt');
  
  expect(typeof student.id).toBe('string');
  expect(typeof student.firstName).toBe('string');
  expect(typeof student.lastName).toBe('string');
  expect(typeof student.email).toBe('string');
  expect(typeof student.dateOfBirth).toBe('string');
  expect(typeof student.createdAt).toBe('string');
  expect(typeof student.updatedAt).toBe('string');
  
  // Validate email format
  expect(student.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  
  // Validate date formats
  expect(new Date(student.dateOfBirth)).toBeInstanceOf(Date);
  expect(new Date(student.createdAt)).toBeInstanceOf(Date);
  expect(new Date(student.updatedAt)).toBeInstanceOf(Date);
};

export const assertCourseShape = (course: any) => {
  expect(course).toHaveProperty('id');
  expect(course).toHaveProperty('courseName');
  expect(course).toHaveProperty('createdAt');
  expect(course).toHaveProperty('updatedAt');
  
  expect(typeof course.id).toBe('string');
  expect(typeof course.courseName).toBe('string');
  expect(typeof course.createdAt).toBe('string');
  expect(typeof course.updatedAt).toBe('string');
  
  expect(course.courseName.trim()).not.toBe('');
  
  expect(new Date(course.createdAt)).toBeInstanceOf(Date);
  expect(new Date(course.updatedAt)).toBeInstanceOf(Date);
};

export const assertResultShape = (result: any) => {
  expect(result).toHaveProperty('id');
  expect(result).toHaveProperty('studentId');
  expect(result).toHaveProperty('courseId');
  expect(result).toHaveProperty('grade');
  expect(result).toHaveProperty('createdAt');
  expect(result).toHaveProperty('updatedAt');
  
  expect(typeof result.id).toBe('string');
  expect(typeof result.studentId).toBe('string');
  expect(typeof result.courseId).toBe('string');
  expect(typeof result.grade).toBe('string');
  expect(typeof result.createdAt).toBe('string');
  expect(typeof result.updatedAt).toBe('string');
  
  expect(['A', 'B', 'C', 'D', 'E', 'F']).toContain(result.grade);
  
  expect(new Date(result.createdAt)).toBeInstanceOf(Date);
  expect(new Date(result.updatedAt)).toBeInstanceOf(Date);
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidDateString = (dateString: string) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const calculateAge = (dateOfBirth: string) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};