import { FaqModel, IFaq } from './faq.interface';
import { Faq } from './faq.model';

// ------------- create faq ---------------
const createFaqIntoDB = async (payload: IFaq): Promise<IFaq | null> => {
  // check if the faq already exists
  const existingFaq = await Faq.findOne({ question: payload.question });
  if (existingFaq) {
    throw new Error('Faq already exists');
  }

  const result = await Faq.create(payload);
  return result;
};

// ------------- update faq ---------------
const updateFaqIntoDB = async (
  id: string,
  payload: Partial<IFaq>
): Promise<IFaq | null> => {
  // check if the faq exists
  const existingFaq = await Faq.findById(id);
  if (!existingFaq) {
    throw new Error('Faq does not exist');
  }

  const result = await Faq.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

// ------------- delete faq ---------------
const deleteFaqIntoDB = async (id: string): Promise<IFaq | null> => {
  // check if the faq exists
  const existingFaq = await Faq.findById(id);
  if (!existingFaq) {
    throw new Error('Faq does not exist');
  }

  const result = await Faq.findByIdAndDelete(id);
  return result;
};

// ------------- get faq ---------------
const getFaqFromDB = async (): Promise<IFaq[] | null> => {
  const result = await Faq.find();
  return result;
};

export const FaqServices = {
  createFaqIntoDB,
  updateFaqIntoDB,
  deleteFaqIntoDB,
  getFaqFromDB,
};
