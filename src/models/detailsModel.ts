import mongoose, { Schema, model, Document } from 'mongoose';

export interface IEducation {
  college: string;
  collegeDegree: string;
  branch?: string;
  passingYear: number;
  cgpa: number;
  board10: string;
  percentage10: number;
  board12: string;
  percentage12: number;
}

export interface IExperienceEntry {
  companyName: string;
  role: string;
  years: number;
}

export interface ICandidate extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  dob: Date;
  contact: string;
  address: string;
  education: IEducation[];
  skills: string[];
  experience: IExperienceEntry[];
  desirableJob: string[];
  profileCompletion: number;
  profileImage: string;
  resume: string;
}

const EducationSchema = new Schema<IEducation>(
  {
    college: { type: String, required: true },
    collegeDegree: { type: String, required: true },
    branch: { type: String },
    passingYear: { type: Number, required: true, min: 1900, max: new Date().getFullYear() },
    cgpa: { type: Number, required: true, min: 0, max: 10 },
    board10: { type: String, required: true },
    percentage10: { type: Number, required: true, min: 0, max: 100 },
    board12: { type: String, required: true },
    percentage12: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IExperienceEntry>(
  {
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    years: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const CandidateSchema = new Schema<ICandidate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: Date, required: true },
    contact: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    education: { type: [EducationSchema], required: true },
    skills: { type: [String], required: true },
    experience: { type: [ExperienceSchema] },
    desirableJob: { type: [String], required: true },
    profileCompletion: { type: Number, required: true, min: 0, max: 100 },
    profileImage: { type: String, required: true },       
    resume: { type: String, required: true },            
  },
  {
    timestamps: true,
  }
);

export default model<ICandidate>('Candidate', CandidateSchema, 'CandidateDetails');