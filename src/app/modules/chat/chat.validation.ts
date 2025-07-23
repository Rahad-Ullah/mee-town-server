import { z } from 'zod';

// create chat validation
export const createChatValidation = z.object({
  participants: z
    .array(z.string(), {
      required_error: 'Participants are required',
    })
    .min(2, 'At least two participants are required'),
});

export const ChatValidations = { createChatValidation };
