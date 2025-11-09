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
import { generateUsername } from '../../../util/generateUsername';

const userSchema = new Schema<IUser, UserModal>(
  {
    name: {
      type: String,
      required: false,
      default: '',
    },
    phone: {
      type: String,
      default: '',
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
      enum: {
        values: Object.values(USER_ROLES),
        message: '{VALUE} is not a valid role',
      },
      required: true,
    },
    username: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    countryCode: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(GENDER),
        message: '{VALUE} is not a valid gender',
      },
    },
    relationshipStatus: {
      type: String,
      enum: {
        values: Object.values(RELATIONSHIP_STATUS),
        message: '{VALUE} is not a valid relationship status',
      },
    },
    profession: {
      type: String,
      default: '',
    },
    nationality: {
      type: String,
      default: '',
    },
    birthday: {
      type: Date,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
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
      enum: {
        values: Object.values(USER_STATUS),
        message: '{VALUE} is not a valid status',
      },
      default: USER_STATUS.ACTIVE,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: false,
    },
    appId: {
      type: String,
      required: false,
    },
    firebaseToken: {
      type: String,
      required: false,
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
  {
    timestamps: true,
  }
);

// Add schema-level validation for updates
userSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
  this.setOptions({ runValidators: true });
});

//exist user check
userSchema.statics.isExistUserById = async (id: string) => {
  const isExist = await User.findByIdAndUpdate(id);
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

userSchema.statics.isUserFullfilled = async (user: Partial<IUser>) => {
  const arr = [
    user?.name,
    user?.birthday,
    user?.interests?.length,
    user?.location,
  ];
  for (let item of arr) {
    if (!item) {
      return false;
    }
  }
  return true;
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

  // generate username
  if (!this.username) {
    const username = await generateUsername(this.email! || '');
    this.username = username;
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
