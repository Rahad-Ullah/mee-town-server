import { sendNotifications } from '../../../helpers/notificationHelper';
import { IPost } from '../post/post.interface';
import { Post } from '../post/post.model';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { IPostReaction, PostReactionModel } from './postReaction.interface';
import { PostReaction } from './postReaction.model';

// --------------- create postReaction ---------------
const createPostReaction = async (payload: IPostReaction) => {
  // check if post exists
  const existingPost = (await Post.findById(payload.post).populate(
    'user'
  )) as any;
  if (!existingPost) {
    throw new Error('Post not found');
  }

  // check if reactor exists
  const existingReactor = await User.findById(payload.reactor);

  // create or update postReaction
  const result = await PostReaction.findOneAndUpdate(
    { post: payload.post, reactor: payload.reactor },
    payload,
    { upsert: true, new: true }
  );

  // send notification to post owner
  if (result) {
    sendNotifications({
      type: 'postReaction',
      receiver: existingPost.user._id,
      title: `${existingReactor?.username} liked to your post`,
      message: `${existingReactor?.username} has reacted to your post "${existingPost.title}"`,
      referenceId: existingPost._id.toString(),
    });
  }

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
