import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import symptomRoutes from './routes/symptom.routes';
import medicationRoutes from './routes/medication.routes';
import visitRoutes from './routes/visit.routes';
import lifestyleRoutes from './routes/lifestyle.routes';
import trackerRoutes from './routes/tracker.routes';
import attachmentRoutes from './routes/attachment.routes';
import aiRoutes from './routes/ai.routes';
import searchRoutes from './routes/search.routes';
import exportRoutes from './routes/export.routes';
import settingsRoutes from './routes/settings.routes';

import { errorHandler } from './middleware/error.middleware';
import { authMiddleware } from './middleware/auth.middleware';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/symptoms', authMiddleware, symptomRoutes);
app.use('/api/medications', authMiddleware, medicationRoutes);
app.use('/api/visits', authMiddleware, visitRoutes);
app.use('/api/lifestyle', authMiddleware, lifestyleRoutes);
app.use('/api/trackers', authMiddleware, trackerRoutes);
app.use('/api/attachments', authMiddleware, attachmentRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/search', authMiddleware, searchRoutes);
app.use('/api/export', authMiddleware, exportRoutes);
app.use('/api/settings', authMiddleware, settingsRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`HealthTrack API running on http://localhost:${PORT}`);
});
