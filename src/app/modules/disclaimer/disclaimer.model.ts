import { Schema, model } from 'mongoose';
import { IDisclaimer, DisclaimerModel } from './disclaimer.interface';
import { DisclaimerType } from './disclaimer.constants';

const disclaimerSchema = new Schema<IDisclaimer, DisclaimerModel>(
  {
    type: {
      type: String,
      enum: {
        values: Object.values(DisclaimerType),
        message: '{VALUE} is not a valid disclaimer type',
      },
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Add schema-level validation for updates
disclaimerSchema.pre(
  ['findOneAndUpdate', 'updateOne', 'updateMany'],
  function () {
    this.setOptions({ runValidators: true });
  }
);

export const Disclaimer = model<IDisclaimer, DisclaimerModel>(
  'Disclaimer',
  disclaimerSchema
);
