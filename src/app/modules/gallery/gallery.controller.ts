import { Request, Response, NextFunction } from 'express';
import { GalleryServices } from './gallery.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { getSingleFilePath } from '../../../shared/getFilePath';

// create gallery controller
const createGallery = catchAsync(async (req: Request, res: Response) => {
  const image = getSingleFilePath(req.files, 'image');
  const payload = { ...req.body, user: req.user.id, image };

  const result = await GalleryServices.createGalleryIntoDB(payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Gallery created successfully',
    data: result,
  });
});

// delete gallery controller
const deleteGallery = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GalleryServices.deleteGalleryFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Gallery deleted successfully',
    data: result,
  });
})

// get my gallery controller
const getMyGallery = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await GalleryServices.getMyGalleryFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Gallery fetched successfully',
    data: result,
  });
})

export const GalleryController = { createGallery, deleteGallery, getMyGallery };
