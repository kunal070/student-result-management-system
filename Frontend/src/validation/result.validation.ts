import { z } from 'zod';

export const resultSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  courseId: z.string().min(1, 'Course is required'),
  score: z.enum(['A', 'B', 'C', 'D', 'E', 'F'], {
    errorMap: () => ({ message: 'Grade must be one of: A, B, C, D, E, or F' }),
  }),
});

export type ResultSchema = z.infer<typeof resultSchema>;
