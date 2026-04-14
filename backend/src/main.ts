import express, { type Express } from 'express';
import cors from 'cors';
import { validateEnv, env } from './config/env.js';
import { prisma } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { loggingMiddleware } from './middleware/logging.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import lessonRoutes from './routes/lessons.js';
import enrollmentRoutes from './routes/enrollments.js';
import progressRoutes from './routes/progress.js';
import quizRoutes from './routes/quizzes.js';
import submissionRoutes from './routes/submissions.js';
import userRoutes from './routes/users.js';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Startup
async function start() {
  try {
    validateEnv();
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connected');

    // Connect to Redis
    await connectRedis();
    console.log('✓ Redis connected');

    app.listen(env.PORT, () => {
      console.log(`\n✓ Server running on http://localhost:${env.PORT}`);
      console.log(`✓ Environment: ${env.NODE_ENV}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
