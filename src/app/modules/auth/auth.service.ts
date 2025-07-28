import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import {
  IAuthResetPassword,
  IChangePassword,
  ILoginData,
  IVerifyEmail,
  IVerifyPhone,
} from '../../../types/auth';
import cryptoToken from '../../../util/cryptoToken';
import generateOTP from '../../../util/generateOTP';
import { ResetToken } from '../resetToken/resetToken.model';
import { User } from '../user/user.model';
import { USER_ROLES, USER_STATUS } from '../../../enums/user';
import { smsHelper } from '../../../helpers/smsHelper';
import { smsTemplate } from '../../../shared/smsTemplate';

// ------------------ login user service ------------ ----------
const loginUserFromDB = async (payload: ILoginData) => {
  const { email, password } = payload;
  const isExistUser = await User.findOne({ email }).select('+password');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //check verified and status
  if (!isExistUser.verified) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please verify your account, then try to login again'
    );
  }

  //check if user is deleted
  if (!isExistUser || isExistUser.isDeleted) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Your account has been deleted.'
    );
  }

  //check user status
  if (isExistUser.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Your account has been deactivated. Please contact the admin'
    );
  }

  //check match password
  if (!(await User.isMatchPassword(password, isExistUser.password!))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
  }

  //create token
  const accessToken = jwtHelper.createToken(
    { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string
  );

  return { accessToken, role: isExistUser.role };
};

// ------------------ social login user service ------------ ----------
const socialLoginFromDB = async (payload: ILoginData) => {
  const { appId } = payload;
  let isExistUser = await User.findOne({ appId });

  if (isExistUser) {
    //check if user is deleted
    if (isExistUser?.isDeleted) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Your account has been deleted.'
      );
    }

    //check user status
    if (isExistUser?.status !== USER_STATUS.ACTIVE) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Your account has been deactivated. Please contact the admin'
      );
    }
  }

  // if user not exist, create new user
  if (!isExistUser) {
    isExistUser = await User.create({
      appId,
      role: USER_ROLES.USER, // default role
      verified: true, // assuming social login users are verified
    });
  }

  //create token
  const accessToken = jwtHelper.createToken(
    { id: isExistUser._id, role: isExistUser.role, appId: isExistUser.appId },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string
  );

  return { accessToken, role: isExistUser.role };
};

// ------------------ login with phone service ------------ ----------
const phoneLoginFromDB = async (payload: ILoginData) => {
  const { phone } = payload;
  let isExistUser = await User.findOne({ phone });

  if (isExistUser) {
    //check if user is deleted
    if (isExistUser?.isDeleted) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Your account has been deleted.'
      );
    }

    //check user status
    if (isExistUser?.status !== USER_STATUS.ACTIVE) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Your account has been deactivated. Please contact the admin'
      );
    }
  }

  // if user not exist, create new user
  if (!isExistUser) {
    isExistUser = await User.create({
      phone,
      role: USER_ROLES.USER, // default role
    });
  }

  //send otp by phone
  const otp = generateOTP();
  const values = {
    otp: otp,
    phone: isExistUser.phone!,
  };

  const loginOTPTemplate = smsTemplate.loginOtp(values);
  smsHelper.sendSMS(loginOTPTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: isExistUser._id },
    { $set: { authentication } }
  );

  return null;
};

// ------------------ forgot password service ------------ ----------
const forgetPasswordToDB = async (email: string) => {
  const isExistUser = await User.isExistUserByEmail(email);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //check if user is deleted
  if (isExistUser.isDeleted) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Your account has been deleted.'
    );
  }

  //check user status
  if (isExistUser.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Your account has been deactivated. Please contact the admin'
    );
  }

  //send mail
  const otp = generateOTP();
  const value = {
    otp,
    email: isExistUser.email,
  };
  const forgetPassword = emailTemplate.resetPassword(value);
  emailHelper.sendEmail(forgetPassword);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate({ email }, { $set: { authentication } });
};

// ------------------ verify otp service ------------ ----------
const verifyEmailToDB = async (payload: IVerifyEmail) => {
  const { email, oneTimeCode } = payload;
  const isExistUser = await User.findOne({ email }).select('+authentication');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!oneTimeCode) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give the otp, check your email we send a code'
    );
  }

  // match otp
  if (isExistUser.authentication?.oneTimeCode !== oneTimeCode) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You provided wrong otp');
  }

  // check expire time
  const date = new Date();
  if (date > isExistUser.authentication?.expireAt) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Otp already expired, Please try again'
    );
  }

  let message;
  let data;
  // update user verify and authentication status when otp verify successful
  if (!isExistUser.verified) {
    await User.findOneAndUpdate(
      { _id: isExistUser._id },
      { verified: true, authentication: { oneTimeCode: null, expireAt: null } }
    );
    message = 'Email verify successfully';
  } else {
    await User.findOneAndUpdate(
      { _id: isExistUser._id },
      {
        authentication: {
          isResetPassword: true,
          oneTimeCode: null,
          expireAt: null,
        },
      }
    );

    //create token ;
    const createToken = cryptoToken();
    await ResetToken.create({
      user: isExistUser._id,
      token: createToken,
      expireAt: new Date(Date.now() + 5 * 60000),
    });
    message =
      'Verification Successful: Please securely store and utilize this code for reset password';
    data = createToken;
  }
  return { data, message };
};

// ------------------ verify otp for phone login ------------ ----------
const verifyPhoneToDB = async (payload: IVerifyPhone) => {
  const { phone, oneTimeCode } = payload;
  const isExistUser = await User.findOne({ phone }).select('+authentication');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!oneTimeCode) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give the otp, check your phone we send a code'
    );
  }

  // match otp
  if (isExistUser.authentication?.oneTimeCode !== oneTimeCode) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You provided wrong otp');
  }

  // check expire time
  const date = new Date();
  if (date > isExistUser.authentication?.expireAt) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Otp already expired, Please try again'
    );
  }

  // update user verify and authentication status when otp verify successful
  await User.findOneAndUpdate(
    { _id: isExistUser._id },
    { verified: true, authentication: { oneTimeCode: null, expireAt: null } }
  );

  //create token
  const accessToken = jwtHelper.createToken(
    { id: isExistUser._id, role: isExistUser.role, phone: isExistUser.phone },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string
  );

  return { accessToken, role: isExistUser.role };
};

// ------------------ reset password service ------------ ----------
const resetPasswordToDB = async (
  token: string,
  payload: IAuthResetPassword
) => {
  const { newPassword, confirmPassword } = payload;
  //isExist token
  const isExistToken = await ResetToken.isExistToken(token);
  if (!isExistToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
  }

  //user permission check
  const isExistUser = await User.findById(isExistToken.user).select(
    '+authentication'
  );
  if (!isExistUser?.authentication?.isResetPassword) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "You don't have permission to change the password. Please click again to 'Forgot Password'"
    );
  }

  //validity check
  const isValid = await ResetToken.isExpireToken(token);
  if (!isValid) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Token expired, Please click again to the forget password'
    );
  }

  //check password
  if (newPassword !== confirmPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "New password and Confirm password doesn't match!"
    );
  }

  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
    authentication: {
      isResetPassword: false,
    },
  };

  await User.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
    new: true,
  });
};

// ------------------ change password service ------------ ----------
const changePasswordToDB = async (
  user: JwtPayload,
  payload: IChangePassword
) => {
  const { currentPassword, newPassword, confirmPassword } = payload;
  const isExistUser = await User.findById(user.id).select('+password');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //check if user is deleted
  if (isExistUser.isDeleted) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Your account has been deleted.'
    );
  }

  //check user status
  if (isExistUser.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Your account has been deactivated. Please contact the admin'
    );
  }

  //current password match
  if (!(await User.isMatchPassword(currentPassword, isExistUser.password!))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect');
  }

  //newPassword and current password
  if (currentPassword === newPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give different password from current password'
    );
  }
  //new password and confirm password check
  if (newPassword !== confirmPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Password and Confirm password doesn't matched"
    );
  }

  //hash password
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
  };
  await User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });
};

export const AuthService = {
  loginUserFromDB,
  socialLoginFromDB,
  phoneLoginFromDB,
  forgetPasswordToDB,
  verifyEmailToDB,
  verifyPhoneToDB,
  resetPasswordToDB,
  changePasswordToDB,
};
