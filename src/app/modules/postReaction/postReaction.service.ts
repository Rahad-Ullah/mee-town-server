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

// --------------- get postReaction by post id ---------------
const getPostReactionByPostId = async (postId: string) => {
  const result = await PostReaction.find({ post: postId }).populate({
    path: 'reactor',
    select: 'name email phone username image',
    match: { isDeleted: false },
  });
  // filter out deleted users
  const filteredResult = result.filter(item => item.reactor !== null);

  return filteredResult;
};

export const PostReactionServices = {
  createPostReaction,
  getPostReactionByPostId,
};