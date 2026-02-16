import { z } from 'zod';

const updateContactInfoZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        message: 'Email is required',
      })
      .nonempty('Email cannot be empty'),
    phone: z
      .string({
        message: 'Phone is required',
      })
      .nonempty('Phone cannot be empty'),
  }),
});

export const ContactInfoValidations = { updateContactInfoZodSchema };
