import { Schema, model } from 'mongoose';
import { ContactInfoModel, IContactInfo } from './contactInfo.interface';

const ContactInfoSchema = new Schema<IContactInfo, ContactInfoModel>(
  {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ContactInfo = model<IContactInfo, ContactInfoModel>(
  'ContactInfo',
  ContactInfoSchema
);
