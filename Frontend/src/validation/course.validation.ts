import { z } from 'zod';

export const courseSchema = z.object({
  courseName: z
    .string()
    .min(1, { message: 'Course name is required' })
    .max(100, { message: 'Course name must be under 100 characters' }),
});

export type CourseSchema = z.infer<typeof courseSchema>;
