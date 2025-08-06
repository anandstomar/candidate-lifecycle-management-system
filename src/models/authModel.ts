
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  status: 'Active' | 'Inactive';
  resumeStatus: 'Created' | 'Not Created';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  hired: 'Yes' | 'No';
}

const authSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  resumeStatus: {
    type: String,
    enum: ['Created', 'Not Created'],
    default: 'Not Created',
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    default: 'Pending',
  },
  hired: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'No',
  },
},
  { timestamps: true }
);

export default mongoose.model<IUser>('User', authSchema, 'User');
