import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
    },
    audience: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // array of targeted customer IDs
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sent'],
      default: 'draft',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // owner of the campaign
    },
  },
  { timestamps: true }
);

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
