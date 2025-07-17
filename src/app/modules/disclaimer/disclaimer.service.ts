import { DisclaimerModel, IDisclaimer } from './disclaimer.interface';
import { Disclaimer } from './disclaimer.model';

// --------------- create/update disclaimer ---------------
export const createDisclaimer = async (payload: IDisclaimer) => {
  const result = await Disclaimer.findOneAndUpdate(
    { type: payload.type },
    payload,
    { upsert: true, new: true }
  ).lean();

  return result;
};

export const DisclaimerServices = { createDisclaimer };
