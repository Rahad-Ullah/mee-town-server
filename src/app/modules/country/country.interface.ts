import { Model } from 'mongoose';

export type ICountry = {
  _id?: string;
  name: string;
  iso2: string;
  iso3: string;
  flag: string;
  currency: string;
  capital: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  region: string;
};

export type CountryModel = Model<ICountry>;
