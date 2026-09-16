import mongoose from 'mongoose';

const positionFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['checkbox', 'select', 'multi-select', 'number', 'text', 'textarea', 'date', 'radio'],
      default: 'checkbox',
    },
    options: [{ type: String, trim: true }],
    required: { type: Boolean, default: false },
    placeholder: { type: String, trim: true },
  },
  { _id: true }
);

const positionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    isActive: { type: Boolean, default: true },
    fields: [positionFieldSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Position', positionSchema);
