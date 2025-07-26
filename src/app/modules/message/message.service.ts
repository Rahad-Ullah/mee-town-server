import { JwtPayload } from 'jsonwebtoken';
import { IMessage, MessageModel } from './message.interface';
import { Chat } from '../chat/chat.model';
import { Message } from './message.model';
import ApiError from '../../../errors/ApiError';
import QueryBuilder from '../../builder/QueryBuilder';

// ----------------- create message -------------------
export const createMessage = async (payload: IMessage): Promise<IMessage> => {
  // check if the chat exists and the sender is a participant
  const isChatExist = await Chat.findOne({
    _id: payload.chat,
    isDeleted: false,
    participants: { $in: [payload.sender] },
  });
  if (!isChatExist) throw new Error('Chat not found or deleted');
  if (!payload.text && !payload.image)
    throw new Error('Text or image is required');

  const result = await Message.create(payload);

  // emit socket event for new message
  //@ts-ignore
  const io = global.io;
  if (io) {
    io.emit(`getMessage::${payload.chat}`, result);
  }

  // update the chat to sort it to the top
  await Chat.findByIdAndUpdate(payload.chat, {});

  return result;
};

// ----------------- get messages by chat id -------------------
export const getChatMessages = async (
  chatId: string,
  query: Record<string, any>,
  user: JwtPayload
) => {
  // check if the chat exists
  const existingChat = await Chat.findById(chatId);
  if (!existingChat) throw new ApiError(401, 'Chat not found');

  // get another participant
  const anotherParticipant = existingChat.participants.filter(
    participant => participant.toString() !== user?.id
  )[0];

  // update seen status those are not seen by the user
  await Message.updateMany(
    { chat: chatId, seenBy: { $nin: [user?.id] } },
    { $addToSet: { seenBy: user?.id } }
  );

  // get messages
  const MessageQuery = new QueryBuilder(
    Message.find({ chat: chatId })
      .populate('sender', 'name email username image')
      .sort({ createdAt: -1 }),
    query
  )
    .paginate()
    .search(['text']);

  const [messages, pagination] = await Promise.all([
    MessageQuery.modelQuery.lean(),
    MessageQuery.getPaginationInfo(),
  ]);

  // add seen status to messages
  const messagesWithStatus = messages.map((message: any) => {
    return {
      ...message,
      seen: message.seenBy
        .map((id: string) => id.toString())
        .includes(anotherParticipant.toString()),
    };
  });

  return { messages: messagesWithStatus, pagination };
};

export const MessageServices = { createMessage, getChatMessages };
