import { z } from 'zod';

//student must need to be at least 10 years old
const MINIMUM_AGE = 10;

export const studentSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required'),

  lastName: z
    .string()
    .min(1, 'Last name is required'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((dob) => {
      const birthDate = new Date(dob);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const isBirthdayPassed =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

      if (!isBirthdayPassed) {
        age--;
      }

      return age >= MINIMUM_AGE;
    }, {
      message: `Student must be at least ${MINIMUM_AGE} years old`,
    }),
});
