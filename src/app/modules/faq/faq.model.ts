import { Schema, model } from 'mongoose';
import { IFaq, FaqModel } from './faq.interface';

const faqSchema = new Schema<IFaq, FaqModel>(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Add schema-level validation for updates
faqSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
  this.setOptions({ runValidators: true });
});

export const Faq = model<IFaq, FaqModel>('Faq', faqSchema);
