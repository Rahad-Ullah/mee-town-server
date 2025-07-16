import { IReaction } from './reaction.interface';
import { Reaction } from './reaction.model';

const createReactionIntoDB = async (payload: IReaction) => {
  // check if user already reacted
  const existReaction = await Reaction.findOne({
    user: payload.user,
    reactor: payload.reactor,
  });

  if (existReaction) {
    const res = await Reaction.findByIdAndUpdate(existReaction._id, payload);
    return res;
  }

  const result = await Reaction.create(payload);
  return result;
};

export const ReactionService = {
  createReactionIntoDB,
};
