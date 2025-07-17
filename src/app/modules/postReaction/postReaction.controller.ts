import { Request, Response, NextFunction } from 'express';
import { PostReactionServices } from './postReaction.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

// --------------- create postReaction ---------------
const createPostReaction = catchAsync(async (req: Request, res: Response) => {
  // append user id to body
  req.body.reactor = req.user?.id;

  const result = await PostReactionServices.createPostReaction(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'PostReaction updated successfully',
    data: result,
  });
});

// --------------- get postReaction by post id ---------------
const getPostReactionByPostId = catchAsync(async (req: Request, res: Response) => {
  const result = await PostReactionServices.getPostReactionByPostId(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'PostReaction fetched successfully',
    data: result,
  });
})

export const PostReactionController = { createPostReaction, getPostReactionByPostId };
