import { Schema, model } from 'mongoose';
import { IPreference, PreferenceModel } from './preference.interface';

const preferenceSchema = new Schema<IPreference, PreferenceModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    airline: {
      type: String,
      required: true,
    },
    airport: {
      type: String,
      required: true,
    },
    hotel: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Add schema-level validation for updates
preferenceSchema.pre(
  ['findOneAndUpdate', 'updateOne', 'updateMany'],
  function () {
    this.setOptions({ runValidators: true });
  }
);

export const Preference = model<IPreference, PreferenceModel>(
  'Preference',
  preferenceSchema
);
