import { User } from '../user/user.model';
import { IReaction } from './reaction.interface';
import { Reaction } from './reaction.model';

// --------------------- create or update reaction ---------------------
const createReactionIntoDB = async (payload: IReaction) => {
  // check if user already reacted
  const existReaction = await Reaction.findOne({
    user: payload.user,
    reactor: payload.reactor,
  });
  // if exist then update it
  if (existReaction) {
    const res = await Reaction.findByIdAndUpdate(existReaction._id, payload, {
      new: true,
    });
    return res;
  }
  // if not exist then create new one
  const result = await Reaction.create(payload);
  return result;
};

// --------------------- get single reaction ---------------------
const getSingleReactionFromDB = async (userId: string, reactorId: string) => {
  // check if the user exist
  const isExistUser = await User.isExistUserById(userId);
  if (!isExistUser) {
    throw new Error("User doesn't exist!");
  }

  const result = await Reaction.findOne({ user: userId, reactor: reactorId });

  if (!result) {
    return {
      user: userId,
      reactor: reactorId,
      isLike: null,
    };
  }
  
  return result;
};

// --------------------- get my reactions ---------------------
const getMyReactionsFromDB = async (userId: string) => {
  const result = await Reaction.find({ reactor: userId }).populate('user');
  return result;
};

export const ReactionService = {
  createReactionIntoDB,
  getSingleReactionFromDB,
  getMyReactionsFromDB,
};
