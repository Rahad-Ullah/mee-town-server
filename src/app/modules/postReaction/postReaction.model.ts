import { model, Schema } from 'mongoose';
import { IPostReaction, PostReactionModel } from './postReaction.interface';
import { Post } from '../post/post.model';

const postReactionSchema = new Schema<IPostReaction, PostReactionModel>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
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

// Static method to find reactions by post
postReactionSchema.statics.findReactionsByPost = async function (
  postId: string
) {
  return await this.find({ post: postId });
};

export const PostReaction = model<IPostReaction, PostReactionModel>(
  'PostReaction',
  postReactionSchema
);
