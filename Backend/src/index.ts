import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import studentRoutes from './routes/student.routes';
import courseRoutes from './routes/course.routes';
import resultRoutes from './routes/result.routes';
import { db } from './lib/database';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', //frontend URL
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'API is running fine.' });
});

// Mount API routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/results', resultRoutes);

// Global error handler 
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  db.close(); // Close SQLite database connection
  process.exit(0);
});