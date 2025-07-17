import { Request, Response, NextFunction } from 'express';
import { FaqServices } from './faq.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

// create faq
const createFaq = catchAsync(async (req: Request, res: Response) => {
  const result = await FaqServices.createFaqIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq created successfully',
    data: result,
  });
});

// update faq
const updateFaq = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await FaqServices.updateFaqIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq updated successfully',
    data: result,
  });
});

// delete faq
const deleteFaq = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await FaqServices.deleteFaqIntoDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq deleted successfully',
    data: result,
  });
});

// get faq
const getFaq = catchAsync(async (req: Request, res: Response) => {
  const result = await FaqServices.getFaqFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq fetched successfully',
    data: result,
  });
});

export const FaqController = { createFaq, updateFaq, deleteFaq, getFaq };
