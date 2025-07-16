import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import QueryBuilder from '../../builder/QueryBuilder';

// ------------------ create user service ------------ ----------
const createUserToDB = async (payload: Partial<IUser>) => {
  // check the payload is empty or not
  if (Object.keys(payload).length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Payload is empty');
  }

  //set role
  payload.role = USER_ROLES.USER;
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } }
  );

  return null;
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.findById(id).select('-authentication');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  if (isExistUser.isDeleted) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User is deleted!');
  }
  if (isExistUser.status === 'Blocked') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User is blocked!');
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

// ---------------------------- get single user -----------------------------
const getSingleUserFromDB = async (id: string): Promise<Partial<IUser>> => {
  const isExistUser = await User.findById(id).select('-authentication');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

// ---------------------------- get all users -----------------------------
const getAllUsersFromDB = async (query: Record<string, any>) => {
  const userQuery = new QueryBuilder(
    User.find({ isDeleted: false }).select('-authentication'),
    query
  )
    .paginate()
    .sort()
    .filter()
    .search(['name', 'email', 'phone', 'username']);

  const [users, pagination] = await Promise.all([
    userQuery.modelQuery.lean(),
    userQuery.getPaginationInfo(),
  ]);

  return { users, pagination };
};

// ------------------ create admin service ------------ ----------
const createAdminToDB = async (payload: Partial<IUser>) => {
  // check the payload is empty or not
  if (Object.keys(payload).length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Payload is empty');
  }

  //set role and verified status
  payload.role = USER_ROLES.ADMIN;
  payload.verified = true;
  const result = await User.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create admin');
  }

  return null;
};

export const UserService = {
  createUserToDB,
  createAdminToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  getSingleUserFromDB,
  getAllUsersFromDB,
};
