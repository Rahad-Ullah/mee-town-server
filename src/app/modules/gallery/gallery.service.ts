import { IGallery } from './gallery.interface';
import { Gallery } from './gallery.model';

// --------------- create gallery service ---------------
const createGalleryIntoDB = async (payload: IGallery) => {
  const result = await Gallery.create(payload);
  return result;
};

export const GalleryServices = { createGalleryIntoDB };
