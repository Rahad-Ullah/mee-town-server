import { Model } from 'mongoose';
import {
  RELATIONSHIP_STATUS,
  USER_ROLES,
  USER_STATUS,
} from '../../../enums/user';

export type IUser = {
  name: string;
  phone?: string;
  email?: string;
  password?: string;
  role: USER_ROLES;
  username?: string;
  location?: string;
  gender?: 'Male' | 'Female';
  relationshipStatus?: RELATIONSHIP_STATUS;
  profession?: string;
  education?: string;
  nationality?: string;
  height?: number;
  birthday?: Date;
  bio?: string;
  image?: string;
  interests?: string[];
  languages?: string[];
  visitedPlaces?: string[];
  status: USER_STATUS;
  verified: boolean;
  isOnline?: boolean;
  isDeleted?: boolean;
  appId?: string;
  firebaseToken?: string;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isExistUserByPhone(phone: string): any;
  isExistUserByUsername(username: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
