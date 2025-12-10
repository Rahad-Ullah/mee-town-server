import { z } from 'zod';

const createVerifyEmailZodSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email('Invalid email address')
      .nonempty('Email cannot be empty'),
    oneTimeCode: z
      .string({
        message: 'One time code is required',
      })
      .nonempty('One time code cannot be empty'),
  }),
});

const createVerifyPhoneZodSchema = z.object({
  body: z.object({
    phone: z
      .string({ message: 'Phone is required' })
      .nonempty('Phone cannot be empty')
      .min(8, 'Phone must be at least 8 characters long')
      .max(15, 'Phone must be at most 15 characters long'),
    oneTimeCode: z
      .string({
        message: 'One time code is required',
      })
      .nonempty('One time code cannot be empty'),
  }),
});

const createLoginZodSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email('Invalid email address')
      .nonempty('Email cannot be empty'),
    password: z
      .string({ message: 'Password is required' })
      .nonempty('Password cannot be empty'),
  }),
});
// social login schema
const createSocialLoginZodSchema = z.object({
  body: z.object({
    appId: z
      .string({ message: 'App ID is required' })
      .nonempty('App ID cannot be empty'),
  }),
});

// phone login schema
const createPhoneLoginZodSchema = z.object({
  body: z.object({
    phone: z
      .string({ message: 'Phone number is required' })
      .nonempty('Phone number cannot be empty')
      .min(8, 'Phone must be at least 8 characters long')
      .max(15, 'Phone must be at most 15 characters long'),
  }),
});

const createForgetPasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email('Invalid email address')
      .nonempty('Email cannot be empty'),
  }),
});

const createResetPasswordZodSchema = z.object({
  body: z.object({
    newPassword: z
      .string({ message: 'Password is required' })
      .nonempty('Password cannot be empty'),
    confirmPassword: z
      .string({
        message: 'Confirm Password is required',
      })
      .nonempty('Confirm Password cannot be empty'),
  }),
});

const createChangePasswordZodSchema = z.object({
  body: z
    .object({
      currentPassword: z
        .string({
          message: 'Current Password is required',
        })
        .nonempty('Current Password cannot be empty'),
      newPassword: z
        .string({ message: 'New Password is required' })
        .nonempty('New Password cannot be empty')
        .min(8, { message: 'Password must be at least 8 characters long' }),
      confirmPassword: z
        .string({
          message: 'Confirm Password is required',
        })
        .nonempty('Confirm Password cannot be empty')
        .min(8, { message: 'Password must be at least 8 characters long' }),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'], // ❗ the error will show up under confirmPassword
    }),
});

export const AuthValidation = {
  createVerifyEmailZodSchema,
  createVerifyPhoneZodSchema,
  createForgetPasswordZodSchema,
  createLoginZodSchema,
  createSocialLoginZodSchema,
  createPhoneLoginZodSchema,
  createResetPasswordZodSchema,
  createChangePasswordZodSchema,
};
