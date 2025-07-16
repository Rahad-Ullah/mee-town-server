import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ReactionService } from './reaction.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createReaction = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  req.body.reactor = user?.id;

  const result = await ReactionService.createReactionIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Reaction created successfully!',
    data: result,
  });
});

// get single reaction
const getSingleReaction = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await ReactionService.getSingleReactionFromDB(req.params.id, user?.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Reaction retrieved successfully!',
    data: result,
  });
});

export const ReactionController = {
  createReaction,
  getSingleReaction,
};
