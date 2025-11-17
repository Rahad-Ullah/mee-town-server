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
    },
    airport: {
      type: String,
    },
    hotel: {
      type: String,
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
