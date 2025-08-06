// src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import candidateRoutes from './routes/detailsRoutes';
import questionRoutes from './routes/testRoutes';
import aggregatedDashboardRoutes from './routes/aggregateRoutes';
import resumeRoutes from './routes/resumeRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', 
}))   
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api', aggregatedDashboardRoutes); 
app.use('/api/resumes', resumeRoutes);

const uri = process.env.MONGO_URI || "mongodb+srv://jobportal:cT2vqGpyLftxBzyz@cluster0.tmfdszp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri ,{
    dbName: 'Candidatelifecyclemanagement'
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

export default app;
