import mongoose from 'mongoose';

const followUpSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Follow-up date is required'],
    },
    note: {
      type: String,
      trim: true,
      // optional field
    },
    status: {
      type: String,
      enum: ['pending', 'done', 'missed'],
      default: 'pending',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true, // links follow-up to the customer it belongs to
    },
  },
  { timestamps: true }
);

const FollowUp = mongoose.model('FollowUp', followUpSchema);

export default FollowUp;
