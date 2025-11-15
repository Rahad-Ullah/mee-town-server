import mongoose from 'mongoose';
import { Country } from '../app/modules/country/country.model';
import { COUNTRIES } from './countries';

export const seedCountries = async () => {
  try {
    // Check if collection is empty
    const count = await Country.countDocuments();
    if (count > 0) return; // Already seeded, nothing to do

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Country.insertMany(COUNTRIES, { session });
      await session.commitTransaction();
      console.log('✅ Countries seeded successfully!');
    } catch (error) {
      await session.abortTransaction();
      console.error('❌ Countries seeding failed, rolled back', error);
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('❌ Seeding check failed:', error);
  }
};
