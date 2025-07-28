import mongoose from 'mongoose';

const mcqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: [arr => arr.length >= 1, 'At least one options required']
  },
  correctOption: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return this.options && v >= 0 && v < this.options.length;
      },
      message: 'correctOption must be a valid index in options array'
    }
  },
  explanation: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ['manual', 'gemini'],
    default: 'manual',
    required: true
  },
  groupId: {
    type: String,
    required: false
  }
}, { timestamps: true });

const MCQ = mongoose.model('MCQ', mcqSchema);
export default MCQ; 