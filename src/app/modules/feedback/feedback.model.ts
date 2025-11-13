import { Schema, model } from 'mongoose';
import { IFeedback, FeedbackModel } from './feedback.interface';

const feedbackSchema = new Schema<IFeedback, FeedbackModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = model<IFeedback, FeedbackModel>(
  'Feedback',
  feedbackSchema
);
