import { z } from 'zod';

const disposableEmailDomains = [
  'tempmail.com', 'throwaway.email', '10minutemail.com', 
  'guerrillamail.com', 'mailinator.com', 'trashmail.com'
];

const isDisposableEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return disposableEmailDomains.includes(domain);
};

export const studentSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters')
    .transform(val => val.trim())
    .refine(val => val.length > 0, { message: 'First name cannot be empty' })
    .refine(val => /^[a-zA-Z\s'-]+$/.test(val), { 
      message: 'First name can only contain letters, spaces, hyphens, and apostrophes' 
    }),
    
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters')
    .transform(val => val.trim())
    .refine(val => val.length > 0, { message: 'Last name cannot be empty' })
    .refine(val => /^[a-zA-Z\s'-]+$/.test(val), { 
      message: 'Last name can only contain letters, spaces, hyphens, and apostrophes' 
    }),
    
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email cannot exceed 100 characters')
    .transform(val => val.trim().toLowerCase())
    .refine(val => !isDisposableEmail(val), {
      message: 'Disposable email addresses are not allowed'
    }),
    
  dateOfBirth: z.string().refine((dob) => {
    const date = new Date(dob);
    const now = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return false;
    }
    
    // Check if date is in the future
    if (date > now) {
      return false;
    }
    
   // Check maximum age (100 years)
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
    if (date < hundredYearsAgo) {
      return false;
    }
    
    // Check minimum age (10 years)
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    return date <= tenYearsAgo;
  }, {
    message: 'Invalid date of birth. Student must be between 10 and 100 years old',
  }),
});