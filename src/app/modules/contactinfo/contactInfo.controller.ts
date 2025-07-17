import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ContactInfoServices } from './contactInfo.service';

const updateContactInfo = catchAsync(async (req: Request, res: Response) => {
    const result = await ContactInfoServices.updateContactInfoIntoDB(req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Contact Info updated successfully',
        data: result
    })
});

export const ContactInfoController = { updateContactInfo};
