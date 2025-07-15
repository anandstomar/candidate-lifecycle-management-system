"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
const uri = process.env.MONGO_URI || "mongodb+srv://jobportal:cT2vqGpyLftxBzyz@cluster0.tmfdszp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose_1.default.connect(uri, {
    dbName: 'Candidatelifecyclemanagement'
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
exports.default = app;
