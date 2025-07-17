import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { PostModel } from './post.interface';
import { Post } from './post.model';
import unlinkFile from '../../../shared/unlinkFile';

// --------------- create post ---------------
const createPostIntoDB = async (payload: PostModel) => {
  const result = await Post.create(payload);
  return result;
};

// --------------- update post ---------------
const updatePostIntoDB = async (id: string, payload: Partial<PostModel>) => {
  // check if post exists
  const existingPost = await Post.findById(id);
  if (!existingPost) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Post not found');
  }

  //unlink file here
  if ('image' in payload) {
    unlinkFile(existingPost.image);
  }

  const result = await Post.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const PostServices = { createPostIntoDB, updatePostIntoDB };
