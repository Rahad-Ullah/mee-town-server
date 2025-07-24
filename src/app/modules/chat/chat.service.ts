import { JwtPayload } from 'jsonwebtoken';
import { IChat } from './chat.interface';
import { Chat } from './chat.model';

// ---------------- create chat service ----------------
export const createChatIntoDB = async (user: JwtPayload, payload: IChat) => {
  const participants = [...payload.participants];
  // push the user id to participants if not already included
  if (!participants.includes(user.id)) {
    participants.push(user.id);
  }

  // create chat if it does not exist
  const isExist = await Chat.findOne({ participants: { $all: participants } });
  if (isExist) {
    return isExist;
  }

  const result = await Chat.create({ participants });
  return result;
};

export const ChatServices = { createChatIntoDB };
