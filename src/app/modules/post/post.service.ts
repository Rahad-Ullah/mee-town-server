import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IPost } from './post.interface';
import { Post } from './post.model';
import unlinkFile from '../../../shared/unlinkFile';
import QueryBuilder from '../../builder/QueryBuilder';
import { PostReaction } from '../postReaction/postReaction.model';
import { User } from '../user/user.model';

// --------------- create post ---------------
const createPostIntoDB = async (payload: IPost) => {
  const result = await Post.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create post');
  }

  // add visited place to the profile
  await User.findByIdAndUpdate(
    payload.user,
    {
      $addToSet: { visitedPlaces: result.place },
    },
    { new: true }
  );

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

// --------------- get posts by user id ---------------
const getPostsByUserIdFromDB = async (userId: any) => {
  const result = await Post.find({ user: userId, isDeleted: false });
  return result;
};

// --------------- get all posts ---------------
const getAllPostsFromDB = async (
  userId: string,
  query: Record<string, any>
) => {
  const postQuery = new QueryBuilder(
    Post.find({ isDeleted: false }).populate(
      'user',
      'name username image location'
    ),
    query
  )
    .paginate()
    .filter()
    .search(['place', 'title', 'message'])
    .sort();

  const [posts, pagination] = await Promise.all([
    postQuery.modelQuery.lean(),
    postQuery.getPaginationInfo(),
  ]);

  // get post reactions of each post
  const postsWithReactions = await Promise.all(
    posts.map(async post => {
      const reactions = await PostReaction.find({
        post: post._id,
        isLike: { $ne: null },
      })
        .populate('reactor', 'name username image')
        .lean();

      const likedReactions = reactions
        .filter(r => r.isLike === true)
        .map(r => r.reactor);

      const myReaction = reactions.find(
        r => r.reactor._id.toString() === userId.toString()
      );

      return {
        ...post,
        likes: likedReactions,
        hasLiked:
          myReaction?.isLike === true
            ? true
            : myReaction?.isLike === false
            ? false
            : null, // flag for if the current user liked the post
      };
    })
  );

  return { posts: postsWithReactions, pagination };
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
  getPostsByUserIdFromDB,
  getAllPostsFromDB,
  getMyLikedPostsFromDB,
};
