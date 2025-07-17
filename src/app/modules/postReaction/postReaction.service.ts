import { Post } from '../post/post.model';
import { IPostReaction, PostReactionModel } from './postReaction.interface';
import { PostReaction } from './postReaction.model';

// --------------- create postReaction ---------------
const createPostReaction = async (payload: IPostReaction) => {
  // check if post exists
  const existingPost = await Post.findById(payload.post);
  if (!existingPost) {
    throw new Error('Post not found');
  }
  // create or update postReaction
  const result = await PostReaction.findOneAndUpdate(
    { post: payload.post, reactor: payload.reactor },
    payload,
    { upsert: true, new: true }
  );

  return result;
};

export const PostReactionServices = { createPostReaction };
