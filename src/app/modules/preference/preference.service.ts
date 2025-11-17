import { IPreference } from './preference.interface';
import { Preference } from './preference.model';

// --------------- update preference service ---------------
const updatePreferenceIntoDB = async (payload: IPreference) => {
  const result = await Preference.findOneAndUpdate(
    { user: payload.user },
    payload,
    {
      upsert: true,
      new: true,
    }
  ).lean();
  return result;
};

export const PreferenceServices = { updatePreferenceIntoDB };
