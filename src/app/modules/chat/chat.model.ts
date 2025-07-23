import { Schema, model } from 'mongoose';
import { IChat, ChatModel } from './chat.interface';

const chatSchema = new Schema<IChat, ChatModel>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = model<IChat, ChatModel>('Chat', chatSchema);
