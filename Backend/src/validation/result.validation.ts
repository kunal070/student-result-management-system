import { z } from 'zod';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const resultSchema = z.object({
  studentId: z.string()
    .refine(val => uuidRegex.test(val), {
      message: 'Invalid student ID format. Must be a valid UUID'
    }),
    
  courseId: z.string()
    .refine(val => uuidRegex.test(val), {
      message: 'Invalid course ID format. Must be a valid UUID'
    }),
    
  grade: z.enum(['A', 'B', 'C', 'D', 'E', 'F'], {
    errorMap: () => ({ message: 'Grade must be one of: A, B, C, D, E, or F' })
  }),
});