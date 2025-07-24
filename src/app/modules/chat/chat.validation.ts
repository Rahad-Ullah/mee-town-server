import { z } from 'zod';

// create chat validation
export const createChatValidation = z.object({
  body: z.object({
    participants: z
      .array(z.string(), {
        required_error: 'Participants are required',
        invalid_type_error: 'Participants must be an array of strings',
      })
      .min(1, 'Min one participants are required'),
  }),
});

export const ChatValidations = { createChatValidation };
