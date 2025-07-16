import { model, Schema } from 'mongoose';
import { IReaction, ReactionModel } from './reaction.interface';

const reactionSchema = new Schema<IReaction, ReactionModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reactor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isLike: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Reaction = model<IReaction, ReactionModel>('Reaction', reactionSchema);
