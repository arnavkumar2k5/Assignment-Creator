"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
require("../config/env");
const redis_1 = require("../config/redis");
const database_1 = require("../config/database");
const assignment_model_1 = require("../models/assignment.model");
const ai_service_1 = require("../services/ai.service");
const redis_2 = require("../config/redis");
const logger_1 = require("../utils/logger");
const publishEvent = async (event, data) => {
    await redis_2.redis.publish('socket-events', JSON.stringify({ event, data }));
};
const processAssignment = async (job) => {
    const { assignmentId } = job.data;
    logger_1.logger.info(`⚙️  Processing assignment: ${assignmentId}`);
    logger_1.logger.info(`🔑 AI Provider: ${process.env.AI_PROVIDER}, Key set: ${!!process.env.GROQ_API_KEY}`);
    await publishEvent('assignment-processing', { assignmentId, status: 'processing' });
    await assignment_model_1.Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });
    const assignment = await assignment_model_1.Assignment.findById(assignmentId);
    if (!assignment)
        throw new Error(`Assignment not found: ${assignmentId}`);
    const generatedPaper = await (0, ai_service_1.generateQuestionPaper)({
        ...assignment.toObject(),
        _id: assignment._id?.toString(),
    });
    const updated = await assignment_model_1.Assignment.findByIdAndUpdate(assignmentId, { status: 'completed', generatedPaper }, { new: true });
    await redis_2.redis.setex(`assignment:${assignmentId}`, 3600, JSON.stringify(updated));
    await publishEvent('assignment-completed', { assignmentId, status: 'completed', data: updated });
    logger_1.logger.info(`✅ Assignment completed: ${assignmentId}`);
};
const startWorker = async () => {
    await (0, database_1.connectDB)();
    // Log env state at startup so we can confirm key is loaded
    logger_1.logger.info(`🔑 GROQ_API_KEY loaded: ${!!process.env.GROQ_API_KEY}`);
    logger_1.logger.info(`🤖 AI_PROVIDER: ${process.env.AI_PROVIDER || 'groq (default)'}`);
    const worker = new bullmq_1.Worker('assignment-generation', processAssignment, {
        connection: (0, redis_1.getRedisConnection)(),
        concurrency: 3,
    });
    worker.on('completed', (job) => logger_1.logger.info(`✅ Job ${job.id} completed`));
    worker.on('failed', async (job, err) => {
        logger_1.logger.error(`❌ Job ${job?.id} failed: ${err.message}`);
        if (job?.data.assignmentId) {
            await assignment_model_1.Assignment.findByIdAndUpdate(job.data.assignmentId, {
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
    worker.on('error', (err) => logger_1.logger.error('Worker error:', err));
    logger_1.logger.info('🚀 Assignment worker started');
};
startWorker();
//# sourceMappingURL=assignment.worker.js.map