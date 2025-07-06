import { generateId } from '../../src/lib/database';

export const studentFactory = {
  build: (overrides: Partial<any> = {}) => ({
    firstName: 'John',
    lastName: 'Doe',
    email: `john.doe.${Date.now()}@example.com`,
    dateOfBirth: '2000-01-01',
    ...overrides,
  }),

  buildMultiple: (count: number, overrides: Partial<any> = {}) => {
    return Array.from({ length: count }, (_, index) => ({
      firstName: `Student${index + 1}`,
      lastName: `Test${index + 1}`,
      email: `student${index + 1}.${Date.now()}@example.com`,
      dateOfBirth: `200${index % 10}-01-01`,
      ...overrides,
    }));
  },
};

export const courseFactory = {
  build: (overrides: Partial<any> = {}) => ({
    courseName: `Course ${Date.now()}`,
    ...overrides,
  }),

  buildMultiple: (count: number, overrides: Partial<any> = {}) => {
    return Array.from({ length: count }, (_, index) => ({
      courseName: `Course ${index + 1} - ${Date.now()}`,
      ...overrides,
    }));
  },
};

export const resultFactory = {
  build: (studentId: string, courseId: string, overrides: Partial<any> = {}) => ({
    studentId,
    courseId,
    grade: 'A',
    ...overrides,
  }),
};