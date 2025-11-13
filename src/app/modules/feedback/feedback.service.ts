import { IFeedback } from './feedback.interface';
import { Feedback } from './feedback.model';

// create feedback service
const createFeedbackIntoDB = async (payload: IFeedback): Promise<IFeedback> => {
  const result = await Feedback.create(payload);
  return result;
};

export const FeedbackServices = {
  createFeedbackIntoDB,
};
