import { Schema, model } from 'mongoose';
import { IPackage, PackageModel } from './package.interface';
import { PACKAGE_UNIT } from './package.constants';

const packageSchema = new Schema<IPackage, PackageModel>(
  {
    unit: {
      type: String,
      enum: Object.values(PACKAGE_UNIT),
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    tag: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Package = model<IPackage, PackageModel>('Package', packageSchema);
