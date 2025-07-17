import { Schema, model } from 'mongoose';
import { IGallery, GalleryModel } from './gallery.interface';

const gallerySchema = new Schema<IGallery, GalleryModel>(
  {
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Gallery = model<IGallery, GalleryModel>('Gallery', gallerySchema);
