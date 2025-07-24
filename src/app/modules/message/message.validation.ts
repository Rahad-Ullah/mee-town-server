import { z } from 'zod';

// Define the validation schema for Message
const createMessageSchema = z.object({
  body: z.object({
    chat: z.string().nonempty(),
    sender: z.string().nonempty(),
    text: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const MessageValidations = { createMessageSchema };
