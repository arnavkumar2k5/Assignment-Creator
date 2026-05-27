import mongoose, { Document, Schema } from 'mongoose';
import { IAssignment } from '../types';

export interface IAssignmentDocument extends Omit<IAssignment, '_id'>, Document {}

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  marks: { type: Number, required: true },
});

const SectionSchema = new Schema({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema],
});

const QuestionTypeSchema = new Schema({
  type: { type: String, required: true },
  count: { type: Number, required: true, min: 1 },
  marks: { type: Number, required: true, min: 1 },
});

const AssignmentSchema = new Schema<IAssignmentDocument>(
  {
    title: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    instructions: { type: String, default: '' },
    questionTypes: { type: [QuestionTypeSchema], required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    generatedPaper: {
      sections: [SectionSchema],
    },
    error: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AssignmentSchema.index({ status: 1, createdAt: -1 });

export const Assignment = mongoose.model<IAssignmentDocument>('Assignment', AssignmentSchema);
