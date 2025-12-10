import { z } from 'zod';

// create chat validation
export const createChatValidation = z.object({
  body: z.object({
    participants: z
      .array(
        z
          .string('Participants are required')
          .nonempty('Participants are required')
      )
      .min(1, 'Min one participants are required'),
  }),
});

export const ChatValidations = { createChatValidation };
