import unlinkFile from '../../../shared/unlinkFile';
import { IGallery } from './gallery.interface';
import { Gallery } from './gallery.model';

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

export const GalleryServices = { createGalleryIntoDB, deleteGalleryFromDB };
