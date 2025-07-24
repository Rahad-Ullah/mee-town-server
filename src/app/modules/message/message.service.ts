import { JwtPayload } from 'jsonwebtoken';
import { IMessage, MessageModel } from './message.interface';
import { Chat } from '../chat/chat.model';
import { Message } from './message.model';

// ----------------- create message -------------------
export const createMessage = async (payload: IMessage): Promise<IMessage> => {
  // check if the chat exists and the sender is a participant
  const isChatExist = await Chat.findOne({
    _id: payload.chat,
    isDeleted: false,
    participants: { $in: [payload.sender] },
  });
  if (!isChatExist) {
    throw new Error('Chat not found or deleted');
  }

  // create message
  const result = await Message.create(payload);
  return result;
};

export const MessageServices = { createMessage };
