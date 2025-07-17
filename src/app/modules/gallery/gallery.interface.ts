import { Model } from 'mongoose';

export type IGallery = {
  _id?: string;
  user: string;
  image: string;
};

export type GalleryModel = Model<IGallery>;
