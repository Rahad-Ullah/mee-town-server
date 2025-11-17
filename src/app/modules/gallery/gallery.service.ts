import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { IGallery } from './gallery.interface';
import { Gallery } from './gallery.model';
import { User } from '../user/user.model';

// --------------- create gallery ---------------
const createGalleryIntoDB = async (payload: IGallery) => {
  const result = await Gallery.create(payload);
  return result;
};

// --------------- delete gallery ---------------
const deleteGalleryFromDB = async (id: string) => {
  // check if the gallery exists
  const isExist = await Gallery.findById(id);
  if (!isExist) {
    throw new Error('Gallery not found');
  }

  const result = await Gallery.findByIdAndDelete(id, { new: true });

  // unlink the image from the server
  if (result) {
    unlinkFile(result.image);
  }

  return result;
};

// --------------- set gallery as profile photo ---------------
const setGalleryAsProfilePhoto = async (id: string) => {
  const existingGallery = await Gallery.findById(id);
  if (!existingGallery) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Image not found!');
  }

  // update the user profile photo
  await User.findByIdAndUpdate(
    existingGallery.user,
    { image: existingGallery.image },
    { new: true }
  );

  return existingGallery;
};

// --------------- get gallery by user id ---------------
const getGalleryFromDB = async (id: string) => {
  const result = await Gallery.find({ user: id });
  return result;
};

export const GalleryServices = {
  createGalleryIntoDB,
  deleteGalleryFromDB,
  setGalleryAsProfilePhoto,
  getGalleryFromDB,
};
