import QueryBuilder from '../../builder/QueryBuilder';
import { IFeedback } from './feedback.interface';
import { Feedback } from './feedback.model';

// ---------------- create feedback ----------------
const createFeedbackIntoDB = async (payload: IFeedback): Promise<IFeedback> => {
  const result = await Feedback.create(payload);
  return result;
};

// ---------------- get all feedback ----------------
const getAllFeedbackFromDB = async (query: Record<string, any>) => {
  const feedbackQuery = new QueryBuilder(Feedback.find(), query)
    .paginate()
    .sort();

  const [data, pagination] = await Promise.all([
    feedbackQuery.modelQuery.lean(),
    feedbackQuery.getPaginationInfo(),
  ]);

  return { data, pagination };
};

export const FeedbackServices = {
  createFeedbackIntoDB,
  getAllFeedbackFromDB,
};
