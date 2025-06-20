import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import prisma from './lib/prisma';
import jobRoutes from './routes/jobs';
import responseRoutes from './routes/responses';
import importRoutes from './routes/import';
import { errorHandler } from './middleware/errorHandler';
import { AddressInfo } from 'net';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/import/markdown', importRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Graceful shutdown
const cleanup = async () => {
  console.log('Shutting down gracefully...');
  try {
    const tmpDir = path.resolve(__dirname, '..', '.tmp');
    await fs.rm(tmpDir, { recursive: true, force: true });
    console.log('Cleanup successful.');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start server with dynamic port fallback
const DEFAULT_PORT = parseInt(process.env.PORT || '3001', 10);
const server = app.listen(DEFAULT_PORT);

server.on('listening', async () => {
  const { port } = server.address() as AddressInfo;
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Write port to a file for the frontend to read
  try {
    const tmpDir = path.resolve(__dirname, '..', '.tmp');
    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(path.join(tmpDir, '.port'), port.toString());
    console.log(`Port ${port} written to ${path.join(tmpDir, '.port')}`);
  } catch (error) {
    console.error('Failed to write port file:', error);
    process.exit(1);
  }
});
server.on('error', (err: any) => {
  if ((err as any).code === 'EADDRINUSE') {
    console.warn(`Port ${DEFAULT_PORT} in use, retrying on random free port...`);
    server.listen(0);
  } else {
    console.error(err);
    process.exit(1);
  }
});

export default app;