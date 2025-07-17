import { PostModel } from './post.interface';
import { Post } from './post.model';

// --------------- create post ---------------
export const createPostIntoDB = async (payload: PostModel) => {
  const result = await Post.create(payload);
  return result;
};



export const PostServices = { createPostIntoDB };
