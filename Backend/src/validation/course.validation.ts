import { z } from 'zod';

export const courseSchema = z.object({
  courseName: z.string()
    .min(3, 'Course name must be at least 3 characters')
    .max(100, 'Course name cannot exceed 100 characters')
    .transform(val => val.trim())
    .refine(val => val.length >= 3, { 
      message: 'Course name must be at least 3 characters after trimming' 
    })
    .refine(val => /^[a-zA-Z0-9\s\-&(),.]+$/.test(val), {
      message: 'Course name contains invalid characters. Only letters, numbers, spaces, and basic punctuation allowed'
    })
    .refine(val => !(/^\s*$/.test(val)), {
      message: 'Course name cannot be only whitespace'
    }),
});