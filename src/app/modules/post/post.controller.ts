import { Request, Response, NextFunction } from 'express';
import { PostServices } from './post.service';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';

// create post
const createPost = catchAsync(async (req: Request, res: Response) => {
  const image = getSingleFilePath(req.files, 'image');
  const payload = { ...req.body, image, user: req.user.id };

  const result = await PostServices.createPostIntoDB(payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post created successfully',
    data: result,
  });
});

// update post
const updatePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const image = getSingleFilePath(req.files, 'image');
  const payload = { ...req.body, image };
  const result = await PostServices.updatePostIntoDB(id, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post updated successfully',
    data: result,
  });
});

// delete post (soft delete)
const deletePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PostServices.deletePostFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post deleted successfully',
    data: result,
  });
});

// get my posts
const getMyPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await PostServices.getMyPostsFromDB(req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Posts retrieved successfully',
    data: result,
  });
})

// get alll posts
const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await PostServices.getAllPostsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Posts retrieved successfully',
    data: result,
  });
})

export const PostController = { createPost, updatePost, deletePost, getMyPosts, getAllPosts };
