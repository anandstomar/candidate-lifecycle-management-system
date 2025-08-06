import mongoose, { Schema, model, Document } from 'mongoose';
import { ICandidate } from './detailsModel';

// Contact information
export interface IResumeContact {
  firstName: string;
  lastName: string;
  location?: string;
  zipCode?: string;
  country?: string;
  phone: string;
  email: string;
  linkedIn?: string;
  github?: string;
  portfolioLink?: string;
  dob?: Date;
}

// Education sections
export interface ITenth {
  school: string;
  board: string;
  startYear: number;
  passingYear: number;
  percentage: number;
}

export interface ITwelfthOrDiploma {
  type: '12th' | 'Diploma';
  board?: string;
  university?: string;
  institution?: string;
  startYear: number;
  passingYear: number;
  percentage: number;
}

export interface IDegree {
  degree: string;
  branch?: string;
  institution: string;
  startYear: number;
  passingYear: number;
  cgpa?: number;
}

// Experience entry (work or internship)
export interface IResumeExperience {
  company: string;
  role: string;
  startDate: Date;
  endDate: Date;
  description?: string;
}

// Project entry
export interface IResumeProject {
  title: string;
  techStack: string[];
  description: string;
  link?: string;
}

// Certification entry
export interface IResumeCertification {
  name: string;
  link?: string;
}

export interface IResume extends Document {
  candidate: mongoose.Types.ObjectId | ICandidate;
  contact: IResumeContact;
  jobTitle?: string;
  languages?: string[];
  education: {
    tenth: ITenth;
    twelfthOrDiploma?: ITwelfthOrDiploma;
    bachelors?: IDegree[];
    masters?: IDegree[];
  };
  experience?: IResumeExperience[];
  internships?: IResumeExperience[];
  projects?: IResumeProject[];
  certifications?: IResumeCertification[];
  skills: string[];
  interests?: string[];
  resumeFile?: string;
  profileImage?: string;
  profileCompletion?: number;
}

const ContactSchema = new Schema<IResume['contact']>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  location: { type: String },
  zipCode: { type: String },
  country: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  linkedIn: { type: String },
  github: { type: String },
  portfolioLink: { type: String },
  dob: { type: Date },
}, { _id: false });

const TenthSchema = new Schema<ITenth>({
  school: { type: String, required: true },
  board: { type: String, required: true },
  startYear: { type: Number, required: true },
  passingYear: { type: Number, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
}, { _id: false });

const TwelfthOrDiplomaSchema = new Schema<ITwelfthOrDiploma>({
  type: { type: String, enum: ['12th', 'Diploma'], required: true },
  board: { type: String },
  university: { type: String },
  institution: { type: String },
  startYear: { type: Number, required: true },
  passingYear: { type: Number, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
}, { _id: false });

const DegreeSchema = new Schema<IDegree>({
  degree: { type: String, required: true },
  branch: { type: String },
  institution: { type: String, required: true },
  startYear: { type: Number, required: true },
  passingYear: { type: Number, required: true },
  cgpa: { type: Number, min: 0, max: 10 },
}, { _id: false });

const ExperienceSchema = new Schema<IResumeExperience>({
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
}, { _id: false });

const ProjectSchema = new Schema<IResumeProject>({
  title: { type: String, required: true },
  techStack: { type: [String], required: true },
  description: { type: String, required: true },
  link: { type: String },
}, { _id: false });

const CertificationSchema = new Schema<IResumeCertification>({
  name: { type: String, required: true },
  link: { type: String },
}, { _id: false });

const ResumeSchema = new Schema<IResume>({
  candidate: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true, unique: true },
  contact: { type: ContactSchema, required: true },
  jobTitle: { type: String },
  languages: { type: [String] },
  education: {
    tenth: { type: TenthSchema, required: true },
    twelfthOrDiploma: { type: TwelfthOrDiplomaSchema },
    bachelors: { type: [DegreeSchema] },
    masters: { type: [DegreeSchema] },
  },
  experience: { type: [ExperienceSchema] },
  internships: { type: [ExperienceSchema] },
  projects: { type: [ProjectSchema] },
  certifications: { type: [CertificationSchema] },
  skills: { type: [String], required: true },
  interests: { type: [String] },
  resumeFile: { type: String },
  profileImage: { type: String },
  profileCompletion: { type: Number, min: 0, max: 100 },
}, { timestamps: true });

export default model<IResume>('Resume', ResumeSchema, 'Resumes');