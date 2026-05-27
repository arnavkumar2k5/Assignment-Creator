"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAssignments = exports.regenerateAssignment = exports.getAssignment = exports.createAssignment = void 0;
const zod_1 = require("zod");
const assignment_model_1 = require("../models/assignment.model");
const assignment_queue_1 = require("../queues/assignment.queue");
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
const fileExtractor_service_1 = require("../services/fileExtractor.service");
const QuestionTypeSchema = zod_1.z.object({
    type: zod_1.z.string().min(1, 'Question type is required'),
    count: zod_1.z.number().int().min(1, 'Count must be at least 1'),
    marks: zod_1.z.number().min(1, 'Marks must be at least 1'),
});
const CreateAssignmentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(200),
    dueDate: zod_1.z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Invalid date' }),
    instructions: zod_1.z.string().optional().default(''),
    questionTypes: zod_1.z.array(QuestionTypeSchema).min(1, 'At least one question type is required'),
});
const createAssignment = async (req, res, next) => {
    try {
        // multipart/form-data sends all fields as strings — parse questionTypes back to array
        const body = { ...req.body };
        const uploadedFile = req.file;
        if ((!body.title || !String(body.title).trim()) && uploadedFile?.originalname) {
            body.title = (0, fileExtractor_service_1.titleFromFileName)(uploadedFile.originalname);
        }
        if (typeof body.questionTypes === 'string') {
            try {
                body.questionTypes = JSON.parse(body.questionTypes);
            }
            catch {
                return res.status(400).json({
                    success: false,
                    errors: { questionTypes: ['Invalid JSON for questionTypes'] },
                });
            }
        }
        const parsed = CreateAssignmentSchema.safeParse(body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
        }
        const { title, dueDate, instructions, questionTypes } = parsed.data;
        const sourceText = await (0, fileExtractor_service_1.extractUploadedText)(uploadedFile);
        const assignment = await assignment_model_1.Assignment.create({
            title,
            dueDate: new Date(dueDate),
            instructions,
            sourceFileName: uploadedFile?.originalname,
            sourceText,
            questionTypes,
            status: 'pending',
        });
        await (0, assignment_queue_1.addAssignmentJob)(assignment._id.toString());
        logger_1.logger.info(`📝 Assignment created: ${assignment._id}`);
        return res.status(201).json({
            success: true,
            data: assignment,
            message: 'Assignment created and queued for generation',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createAssignment = createAssignment;
const getAssignment = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Check Redis cache
        const cached = await redis_1.redis.get(`assignment:${id}`);
        if (cached) {
            const data = JSON.parse(cached);
            return res.json({ success: true, data, cached: true });
        }
        const assignment = await assignment_model_1.Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }
        if (assignment.status === 'completed') {
            await redis_1.redis.setex(`assignment:${id}`, 3600, JSON.stringify(assignment));
        }
        return res.json({ success: true, data: assignment });
    }
    catch (error) {
        next(error);
    }
};
exports.getAssignment = getAssignment;
const regenerateAssignment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const assignment = await assignment_model_1.Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }
        if (assignment.status === 'processing') {
            return res.status(409).json({ success: false, message: 'Assignment is already being processed' });
        }
        await assignment_model_1.Assignment.findByIdAndUpdate(id, {
            status: 'pending',
            generatedPaper: undefined,
            error: undefined,
        });
        await redis_1.redis.del(`assignment:${id}`);
        await (0, assignment_queue_1.addAssignmentJob)(id);
        logger_1.logger.info(`🔄 Assignment queued for regeneration: ${id}`);
        return res.json({ success: true, message: 'Assignment queued for regeneration' });
    }
    catch (error) {
        next(error);
    }
};
exports.regenerateAssignment = regenerateAssignment;
const listAssignments = async (req, res, next) => {
    try {
        const assignments = await assignment_model_1.Assignment.find().sort({ createdAt: -1 }).limit(20).select('-generatedPaper');
        return res.json({ success: true, data: assignments });
    }
    catch (error) {
        next(error);
    }
};
exports.listAssignments = listAssignments;
//# sourceMappingURL=assignment.controller.js.map