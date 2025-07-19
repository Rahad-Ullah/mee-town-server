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

// ---------------- update package ----------------
const updatePackageIntoDB = async (id: string, payload: Partial<IPackage>): Promise<IPackage | null> => {
  // check if the package exists
  const isPackageExist = await Package.findById(id);
  if (!isPackageExist) {
    throw new Error('Package not found');
  }

  const result = await Package.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

// ---------------- delete package (soft delete) ----------------
const deletePackageIntoDB = async (id: string): Promise<IPackage | null> => {
    // check if the package exists
    const isPackageExist = await Package.findById(id);
    if (!isPackageExist) {
      throw new Error('Package not found');
    }
    // check if the package is already deleted
    if (isPackageExist.isDeleted) {
      throw new Error('Package already deleted');
    }
    
  const result = await Package.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return result;
};

// ---------------- get all packages ----------------
const getAllPackagesFromDB = async (): Promise<IPackage[]> => {
  const result = await Package.find({ isDeleted: false });
  return result;
};

export const PackageServices = {createPackageIntoDB, updatePackageIntoDB, deletePackageIntoDB, getAllPackagesFromDB};
