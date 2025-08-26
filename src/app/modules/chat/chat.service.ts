import { JwtPayload } from 'jsonwebtoken';
import { IChat } from './chat.interface';
import { Chat } from './chat.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { IMessage } from '../message/message.interface';
import { Message } from '../message/message.model';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

// ---------------- create chat service ----------------
export const createChatIntoDB = async (user: JwtPayload, payload: IChat) => {
  const participants = [...payload.participants];
  // push the user id to participants if not already included
  if (!participants.includes(user.id)) {
    participants.push(user.id);
  }

  // get another participant data
  const anotherParticipantId = participants.find(p => p !== user.id);
  const anotherParticipant = await User.findById(anotherParticipantId).select(
    'name username image isOnline'
  );

  // create chat if it does not exist
  const isExist = await Chat.findOne({ participants: { $all: participants } });
  if (isExist) {
    return { ...isExist.toObject(), anotherParticipant };
  }

  const result = await Chat.create({ participants });

  return { ...result.toObject(), anotherParticipant };
};

// ---------------- DELETE CHAT ----------------
const deleteChatFromDB = async (chatId: string) => {
  const isExist = await Chat.findById(chatId);
  if (!isExist) {
    throw new Error('Chat not found');
  }

  const result = await Chat.findByIdAndUpdate(
    chatId,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

// ---------------- get my chats / get by id ----------------
const getMyChatsFromDB = async (
  user: JwtPayload,
  query: Record<string, any>
) => {
  const chats = await Chat.find({ participants: { $in: [user.id] } })
    .populate({
      path: 'participants',
      select: 'name email username image isOnline',
      match: {
        isDeleted: false,
        _id: { $ne: user.id }, // Exclude user.id in the populated participants
        ...(query?.searchTerm && {
          name: { $regex: query?.searchTerm, $options: 'i' },
        }),
      }, // Apply $regex only if search is valid },
    })
    .select('participants updatedAt')
    .sort('-updatedAt');

  // Filter out chats where no participants match the search (empty participants)
  const filteredChats = chats?.filter(
    (chat: any) => chat?.participants?.length > 0
  );

  //Use Promise.all to get the last message for each chat
  const chatList = await Promise.all(
    filteredChats?.map(async (chat: any) => {
      const data = chat?.toObject();

      const lastMessage: IMessage | null = await Message.findOne({
        chat: chat?._id,
      })
        .sort({ createdAt: -1 })
        .select('text image createdAt sender');

      // find unread messages count
      const unreadCount = await Message.countDocuments({
        chat: chat?._id,
        seenBy: { $nin: [user.id] },
      });

      return {
        ...data,
        participants: data.participants,
        unreadCount: unreadCount || 0,
        lastMessage: lastMessage || null,
      };
    })
  );

  return chatList;
};

// ---------------- get online chats ----------------
const getOnlineChatsFromDB = async (
  user: JwtPayload,
  query: Record<string, any>
) => {
  const myChats = await getMyChatsFromDB(user, query);

  // get only online chats
  const onlineChats = myChats.filter(
    chat => chat.participants.some((p: IUser) => p.isOnline) // check if any participant is online
  );

  return onlineChats;
};

export const ChatServices = {
  createChatIntoDB,
  deleteChatFromDB,
  getMyChatsFromDB,
  getOnlineChatsFromDB,
};
