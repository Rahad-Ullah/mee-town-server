import { IDisclaimer } from './disclaimer.interface';
import { Disclaimer } from './disclaimer.model';

// --------------- create/update disclaimer ---------------
export const createDisclaimerIntoDB = async (payload: IDisclaimer) => {
  const result = await Disclaimer.findOneAndUpdate(
    { type: payload.type },
    payload,
    { upsert: true, new: true }
  ).lean();

  return result;
};

// --------------- get disclaimer ---------------
export const getDisclaimerFromDB = async (type: string) => {
  const result = await Disclaimer.findOne({ type }).lean();
  return result || '';
};

export const DisclaimerServices = {
  createDisclaimerIntoDB,
  getDisclaimerFromDB,
};
