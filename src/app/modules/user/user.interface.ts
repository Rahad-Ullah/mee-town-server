import { Model } from 'mongoose';
import { RelationshipStatus, USER_ROLES } from '../../../enums/user';

export type IUser = {
  name: string;
  phone?: string;
  email?: string;
  password?: string;
  role: USER_ROLES;
  username?: string;
  location?: string;
  gender?: 'Male' | 'Female';
  relationshipStatus?: RelationshipStatus;
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
  status: 'Active' | 'Blocked';
  verified: boolean;
  isDeleted?: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
