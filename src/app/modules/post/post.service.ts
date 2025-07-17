import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IPost, PostModel } from './post.interface';
import { Post } from './post.model';
import unlinkFile from '../../../shared/unlinkFile';
import QueryBuilder from '../../builder/QueryBuilder';
import { PostReaction } from '../postReaction/postReaction.model';

// --------------- create post ---------------
const createPostIntoDB = async (payload: IPost) => {
  const result = await Post.create(payload);
  return result;
};

// --------------- update post ---------------
const updatePostIntoDB = async (id: string, payload: Partial<IPost>) => {
  // check if post exists
  const existingPost = await Post.findById(id);
  if (!existingPost) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Post not found');
  }

  const result = await Post.findByIdAndUpdate(id, payload, { new: true });

  //unlink file here
  if (result && payload.image) {
    unlinkFile(existingPost.image);
  }

  return result;
};

// --------------- delete post softly ---------------
const deletePostFromDB = async (id: string) => {
  // check if post exists
  const existingPost = await Post.findById(id);
  if (!existingPost) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Post not found');
  }
  // check if already deleted
  if (existingPost.isDeleted) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Post already deleted');
  }

  const result = await Post.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  // unlink file here
  if (result) {
    unlinkFile(existingPost.image);
  }
  return result;
};

// --------------- get my posts ---------------
const getMyPostsFromDB = async (user: any) => {
  const result = await Post.find({ user: user.id, isDeleted: false });
  return result;
};

// --------------- get all posts ---------------
const getAllPostsFromDB = async (query: Record<string, any>) => {
  const postQuery = new QueryBuilder(Post.find({ isDeleted: false }), query)
    .paginate()
    .filter()
    .search(['place', 'title', 'message'])
    .sort();

  const [posts, pagination] = await Promise.all([
    postQuery.modelQuery.lean(),
    postQuery.getPaginationInfo(),
  ]);
  return { posts, pagination };
};

// --------------- get my liked posts ---------------
const getMyLikedPostsFromDB = async (user: any) => {
  const result = await PostReaction.find({
    reactor: user.id,
    isLike: true,
  })
    .populate('post')
    .select('post');

  // return only post
  return result.map(item => item.post);
};

export const PostServices = {
  createPostIntoDB,
  updatePostIntoDB,
  deletePostFromDB,
  getMyPostsFromDB,
  getAllPostsFromDB,
  getMyLikedPostsFromDB,
};
