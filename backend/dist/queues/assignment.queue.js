"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPdfJob = exports.addAssignmentJob = exports.pdfQueue = exports.assignmentQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
const connection = (0, redis_1.getRedisConnection)();
exports.assignmentQueue = new bullmq_1.Queue('assignment-generation', {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
    },
});
exports.pdfQueue = new bullmq_1.Queue('pdf-generation', {
    connection,
    defaultJobOptions: {
        attempts: 2,
        backoff: { type: 'fixed', delay: 3000 },
        removeOnComplete: { count: 50 },
        removeOnFail: { count: 25 },
    },
});
const addAssignmentJob = async (assignmentId) => {
    await exports.assignmentQueue.add('generate', { assignmentId }, { jobId: `assignment-${assignmentId}` });
    logger_1.logger.info(`📥 Job queued for assignment: ${assignmentId}`);
};
exports.addAssignmentJob = addAssignmentJob;
const addPdfJob = async (assignmentId) => {
    await exports.pdfQueue.add('generate-pdf', { assignmentId }, { jobId: `pdf-${assignmentId}` });
    logger_1.logger.info(`📥 PDF job queued for assignment: ${assignmentId}`);
};
exports.addPdfJob = addPdfJob;
//# sourceMappingURL=assignment.queue.js.map