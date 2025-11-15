import { Schema, model } from 'mongoose';
import { CountryModel, ICountry } from './country.interface';

const countrySchema = new Schema<ICountry, CountryModel>({
  name: {
    type: String,
    required: true,
  },
  iso2: {
    type: String,
    required: true,
  },
  iso3: {
    type: String,
    required: true,
  },
  flag: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  capital: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  region: {
    type: String,
    required: true,
  },
});

// Add schema-level validation for updates
countrySchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
  this.setOptions({ runValidators: true });
});

export const Country = model<ICountry, CountryModel>('Country', countrySchema);
