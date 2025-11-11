import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

// create user
const createUser = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;
  const result = await UserService.createUserToDB(userData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User created successfully. Please check your email for OTP.',
    data: result,
  });
});

// create admin
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...payload } = req.body;
  const result = await UserService.createAdminToDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin created successfully.',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  let image = getSingleFilePath(req.files, 'image');

  const payload = {
    image,
    ...req.body,
  };
  // update location in the payload
  if (req.body.location) {
    const [longitude, latitude] = req.body.location;
    payload.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
  }

  // if (payload.location) {
  //   // Split by one or more spaces using regex and add to the payload
  //   const [countryCode, ...countryNameParts] = payload.location.trim().split(' ');
  //   payload.countryCode = countryCode;
  //   payload.location = countryNameParts.join(' ');
  // }

  const result = await UserService.updateProfileToDB(user, payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile updated successfully',
    data: result,
  });
});

// toggle user status
const toggleUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.toggleUserStatusIntoDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User status updated successfully.',
    data: result,
  });
})

// delete user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User deleted successfully',
    data: result,
  });
});

// delete by email-password
const deleteByEmailPassword = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.deleteByEmailPassword(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User deleted successfully',
      data: result,
    });
  }
);

// get user profile
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const result = await UserService.getSingleUserFromDB(id, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User data retrieved successfully',
    data: result,
  });
});

// get user profile
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

// get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await UserService.getAllUsersFromDB(query, req.user?.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users data retrieved successfully',
    data: result?.data,
    pagination: result?.pagination,
  });
});

// discover users
const discoverUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  
  const result = await UserService.getAllUsersFromDB(query, req.user?.id);
  const filteredUsers = result?.data.filter((user: any) => user?._id?.toString() !== req.user?.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users data retrieved successfully',
    data: filteredUsers,
    pagination: result?.pagination,
  });
});

export const UserController = {
  createUser,
  createAdmin,
  getUserProfile,
  updateProfile,
  toggleUserStatus,
  deleteUser,
  deleteByEmailPassword,
  getSingleUser,
  getAllUsers,
  discoverUsers
};
