import { Worker, Job } from 'bullmq';
import '../config/env';

import { getRedisConnection } from '../config/redis';
import { connectDB } from '../config/database';
import { Assignment } from '../models/assignment.model';
import { generateQuestionPaper } from '../services/ai.service';
import { redis } from '../config/redis';
import { JobData } from '../types';
import { logger } from '../utils/logger';

const publishEvent = async (event: string, data: object) => {
  await redis.publish('socket-events', JSON.stringify({ event, data }));
};

const processAssignment = async (job: Job<JobData>): Promise<void> => {
  const { assignmentId } = job.data;
  logger.info(`⚙️  Processing assignment: ${assignmentId}`);
  logger.info(`🔑 AI Provider: ${process.env.AI_PROVIDER}, Key set: ${!!process.env.GROQ_API_KEY}`);

  await publishEvent('assignment-processing', { assignmentId, status: 'processing' });
  await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new Error(`Assignment not found: ${assignmentId}`);

  const generatedPaper = await generateQuestionPaper({
    ...assignment.toObject(),
    _id: assignment._id?.toString(),
  });

  const updated = await Assignment.findByIdAndUpdate(
    assignmentId,
    { status: 'completed', generatedPaper },
    { new: true }
  );

  await redis.setex(`assignment:${assignmentId}`, 3600, JSON.stringify(updated));
  await publishEvent('assignment-completed', { assignmentId, status: 'completed', data: updated });

  logger.info(`✅ Assignment completed: ${assignmentId}`);
};

const startWorker = async () => {
  await connectDB();

  // Log env state at startup so we can confirm key is loaded
  logger.info(`🔑 GROQ_API_KEY loaded: ${!!process.env.GROQ_API_KEY}`);
  logger.info(`🤖 AI_PROVIDER: ${process.env.AI_PROVIDER || 'groq (default)'}`);

  const worker = new Worker<JobData>('assignment-generation', processAssignment, {
    connection: getRedisConnection(),
    concurrency: 3,
  });

  worker.on('completed', (job) => logger.info(`✅ Job ${job.id} completed`));
  worker.on('failed', async (job, err) => {
    logger.error(`❌ Job ${job?.id} failed: ${err.message}`);
    if (job?.data.assignmentId) {
      await Assignment.findByIdAndUpdate(job.data.assignmentId, {
        status: 'failed',
        error: err.message,
      });
      await publishEvent('assignment-failed', {
        assignmentId: job.data.assignmentId,
        status: 'failed',
        error: err.message,
      });
    }
  });
  worker.on('error', (err) => logger.error('Worker error:', err));

  logger.info('🚀 Assignment worker started');
};

startWorker();
