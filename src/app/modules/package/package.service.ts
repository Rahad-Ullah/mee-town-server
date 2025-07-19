import { IPackage } from './package.interface';
import { Package } from './package.model';

// ---------------- create package ----------------
const createPackageIntoDB = async (payload: IPackage): Promise<IPackage | null> => {
    // check if same package already exists
    const isPackageExist = await Package.findOne({ unit: payload.unit, duration: payload.duration });
    if (isPackageExist) {
      throw new Error('Same package already exists');
    }
    
  const result = await Package.create(payload);
  return result
};

export const PackageServices = {createPackageIntoDB};
