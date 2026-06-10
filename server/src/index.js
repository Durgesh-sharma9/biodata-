import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import planRoutes from './routes/planRoutes.js';
import creditPackageRoutes from './routes/creditPackageRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import creditRoutes from './routes/creditRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import applicantRoutes from './routes/applicantRoutes.js';
import importRoutes from './routes/importRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/credit-packages', creditPackageRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/applicant', applicantRoutes);
app.use('/api/import', importRoutes);
app.use('/api/admin', superAdminRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
