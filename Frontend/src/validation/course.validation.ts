import { z } from 'zod';

export const courseSchema = z.object({
  courseName: z.string()
    .min(2, 'Course name must be at least 2 characters')
    .max(20, 'Course name cannot exceed 20 characters')
    .refine(val => /^[a-zA-Z0-9\s\-&(),.]+$/.test(val), {
      message: 'Course name contains invalid characters. Only letters, numbers, spaces, and basic punctuation allowed'
    })
    .refine(val => !(/^\s*$/.test(val)), {
      message: 'Course name cannot be only whitespace'
    }),
});   

export type CourseSchema = z.infer<typeof courseSchema>;
