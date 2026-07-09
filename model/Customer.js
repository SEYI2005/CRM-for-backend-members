import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      // optional field, no `required`
    },
    tags: {
      type: [String], // e.g. ['vip', 'lagos']
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // every customer belongs to a user
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
