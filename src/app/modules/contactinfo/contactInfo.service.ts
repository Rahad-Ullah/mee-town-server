import { IContactInfo } from './contactInfo.interface';
import { ContactInfo } from './contactInfo.model';

// -------------- create/update contact info --------------
const updateContactInfoIntoDB = async (payload: IContactInfo) => {
  const result = await ContactInfo.findOneAndUpdate({}, payload, {
    upsert: true,
    new: true,
  }).lean();
  return result;
};

export const ContactInfoServices = { updateContactInfoIntoDB };
