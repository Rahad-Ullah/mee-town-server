import { Request, Response, NextFunction } from 'express';
import { PostServices } from './post.service';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';

// create post
const createPost = catchAsync(async (req: Request, res: Response) => {
  const image = getSingleFilePath(req.files, 'image');
  const payload = { ...req.body, image, user: req.user.id };

  const result = await PostServices.createPostIntoDB(payload);
  res.status(200).json({
    success: true,
    message: 'Post created successfully',
    data: result,
  });
});

export const PostController = { createPost };
