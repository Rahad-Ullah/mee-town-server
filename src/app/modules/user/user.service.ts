import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES, USER_STATUS } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { ISubscription } from '../subscription/subscription.interface';
import { Subscription } from '../subscription/subscription.model';
import { SubscriptionStatus } from '../subscription/subscription.constants';

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
  const isExistUser: any = await User.findById(id)
    .select('-authentication')
    .populate({
      path: 'subscription',
    });
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  if (isExistUser.isDeleted) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User is deleted!');
  }
  if (isExistUser.status === 'Blocked') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User is blocked!');
  }

  // check if the subscription is expired
  if (isExistUser?.subscription) {
    const subscription = isExistUser.subscription as ISubscription;
    if (new Date(subscription.expiresDate) < new Date()) {
      await Subscription.findByIdAndUpdate(subscription._id, {
        status: SubscriptionStatus.EXPIRED,
      });
    }
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

  // check if username already taken
  if (payload.username) {
    if (await User.isExistUserByUsername(payload.username)) {
      throw new ApiError(StatusCodes.CONFLICT, 'Username already taken!');
    }
  }

  //unlink file here
  if (payload.image && isExistUser.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

// ---------------------------- get single user -----------------------------
const getSingleUserFromDB = async (id: string): Promise<Partial<IUser>> => {
  const isExistUser = await User.findById(id)
    .select('-authentication')
    .populate('subscription');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

// ---------------------------- get all users -----------------------------
const getAllUsersFromDB = async (query: Record<string, any>) => {
  const filter: Record<string, any> = { isDeleted: false };
  // filter by user interest
  if (query.interest && query.interest !== 'null') {
    filter.interests = { $in: [query.interest] };
  }

  // filter by user age range
  if (
    query.minAge &&
    query.maxAge &&
    !isNaN(Number(query.minAge)) &&
    !isNaN(Number(query.maxAge))
  ) {
    const currentDate = new Date();
    const minBirthDate = new Date(
      currentDate.getFullYear() - Number(query.minAge),
      currentDate.getMonth(),
      currentDate.getDate()
    ).toISOString();
    const maxBirthDate = new Date(
      currentDate.getFullYear() - Number(query.maxAge),
      currentDate.getMonth(),
      currentDate.getDate()
    ).toISOString();

    filter.birthday = {
      $lte: new Date(minBirthDate),
      $gte: new Date(maxBirthDate),
    };
  }

  const userQuery = new QueryBuilder(
    User.find(filter).select('-authentication').populate('subscription'),
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

// ---------------------------- soft delete user -----------------------------
const deleteUserFromDB = async (id: string): Promise<Partial<IUser> | null> => {
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  if (isExistUser.isDeleted) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User already deleted!');
  }

  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return result;
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

// toggle admin status
const toggleUserStatusIntoDB = async (id: string) => {
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (isExistUser.status === USER_STATUS.BLOCKED) {
    return await User.findByIdAndUpdate(id, { status: USER_STATUS.ACTIVE }, { new: true });
  } else if (isExistUser.status === USER_STATUS.ACTIVE) {
    return await User.findByIdAndUpdate(id, { status: USER_STATUS.BLOCKED }, { new: true });
  }
};

export const UserService = {
  createUserToDB,
  createAdminToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  toggleUserStatusIntoDB,
  deleteUserFromDB,
  getSingleUserFromDB,
  getAllUsersFromDB,
};
