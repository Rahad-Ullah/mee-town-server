import { Model } from 'mongoose';
import { PACKAGE_UNIT } from './package.constants';

export type IPackage = {
  _id?: string;
  unit: PACKAGE_UNIT;
  duration: number;
  unitPrice: number;
  price: number;
  discount: number;
  totalPrice: number;
  tag: string;
  isDeleted: boolean;
};

export type PackageModel = Model<IPackage>;
