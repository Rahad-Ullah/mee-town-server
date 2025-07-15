import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import {
  GENDER,
  RELATIONSHIP_STATUS,
  USER_ROLES,
  USER_STATUS,
} from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { IUser, UserModal } from './user.interface';

const userSchema = new Schema<IUser, UserModal>(
  {
    name: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
      minlength: 8,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true,
    },
    username: {
      type: String,
    },
    location: {
      type: String,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    relationshipStatus: {
      type: String,
      enum: Object.values(RELATIONSHIP_STATUS),
    },
    profession: {
      type: String,
    },
    education: {
      type: String,
    },
    nationality: {
      type: String,
    },
    height: {
      type: Number,
    },
    birthday: {
      type: Date,
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
      default: 'https://i.ibb.co/z5YHLV9/profile.png',
    },
    interests: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    visitedPlaces: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: 'Active',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    authentication: {
      type: {
        isResetPassword: {
          type: Boolean,
          default: false,
        },
        oneTimeCode: {
          type: Number,
          default: null,
        },
        expireAt: {
          type: Date,
          default: null,
        },
      },
    },
  },
  { timestamps: true }
);

//exist user check
userSchema.statics.isExistUserById = async (id: string) => {
  const isExist = await User.findById(id);
  return isExist;
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
  const isExist = await User.findOne({ email });
  return isExist;
};

userSchema.statics.isExistUserByPhone = async (phone: string) => {
  const isExist = await User.findOne({ phone });
  return isExist;
};

userSchema.statics.isExistUserByUsername = async (username: string) => {
  const isExist = await User.findOne({ username });
  return isExist;
};

//is match password
userSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

// pre save middleware
userSchema.pre('save', async function (next) {
  if (this.email) {
    const isExist = await User.findOne({ email: this.email });
    if (isExist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');
    }
  }

  if (this.username) {
    const isUsernameExist = await User.findOne({ username: this.username });
    if (isUsernameExist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Username already taken!');
    }
  }

  if (this.phone) {
    const isExistByPhone = await User.findOne({ phone: this.phone });
    if (isExistByPhone) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Phone number already exist!'
      );
    }
  }

  // Only hash the password if it has been modified and exists
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

export const User = model<IUser, UserModal>('User', userSchema);
