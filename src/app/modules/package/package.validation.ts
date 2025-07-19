import { z } from 'zod';
import { PACKAGE_UNIT } from './package.constants';

const createPackageSchema = z.object({
  body: z.object({
    unit: z.nativeEnum(PACKAGE_UNIT),
    duration: z.number().positive().min(1),
    unitPrice: z.number().positive().min(1),
    price: z.number().positive().min(1),
    discount: z.number().min(0),
    totalPrice: z.number().positive().min(1),
    tag: z.string().trim().optional(),
    isDeleted: z.boolean().default(false),
  }),
});

const updatePackageSchema = z.object({
  body: z.object({
    unit: z.nativeEnum(PACKAGE_UNIT).optional(),
    duration: z.number().positive().min(1).optional(),
    unitPrice: z.number().positive().min(1).optional(),
    price: z.number().positive().min(1).optional(),
    discount: z.number().min(0).optional(),
    totalPrice: z.number().positive().min(1).optional(),
    tag: z.string().trim().optional().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const PackageValidations = { createPackageSchema, updatePackageSchema };
