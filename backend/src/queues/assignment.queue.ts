import { Queue } from 'bullmq';
import { getRedisConnection } from '../config/redis';
import { JobData } from '../types';
import { logger } from '../utils/logger';

const connection = getRedisConnection();

export const assignmentQueue = new Queue<JobData>('assignment-generation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

export const pdfQueue = new Queue<JobData>('pdf-generation', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'fixed', delay: 3000 },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 25 },
  },
});

export const addAssignmentJob = async (assignmentId: string): Promise<void> => {
  await assignmentQueue.add('generate', { assignmentId }, { jobId: `assignment-${assignmentId}` });
  logger.info(`📥 Job queued for assignment: ${assignmentId}`);
};

export const addPdfJob = async (assignmentId: string): Promise<void> => {
  await pdfQueue.add('generate-pdf', { assignmentId }, { jobId: `pdf-${assignmentId}` });
  logger.info(`📥 PDF job queued for assignment: ${assignmentId}`);
};
