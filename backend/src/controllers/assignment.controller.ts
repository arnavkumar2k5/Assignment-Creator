import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Assignment } from '../models/assignment.model';
import { addAssignmentJob } from '../queues/assignment.queue';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';

const QuestionTypeSchema = z.object({
  type: z.string().min(1, 'Question type is required'),
  count: z.number().int().min(1, 'Count must be at least 1'),
  marks: z.number().min(1, 'Marks must be at least 1'),
});

const CreateAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  dueDate: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Invalid date' }),
  instructions: z.string().optional().default(''),
  questionTypes: z.array(QuestionTypeSchema).min(1, 'At least one question type is required'),
});

export const createAssignment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // multipart/form-data sends all fields as strings — parse questionTypes back to array
    const body = { ...req.body };
    if (typeof body.questionTypes === 'string') {
      try {
        body.questionTypes = JSON.parse(body.questionTypes);
      } catch {
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

    const assignment = await Assignment.create({
      title,
      dueDate: new Date(dueDate),
      instructions,
      questionTypes,
      status: 'pending',
    });

    await addAssignmentJob(assignment._id.toString());

    logger.info(`📝 Assignment created: ${assignment._id}`);

    return res.status(201).json({
      success: true,
      data: assignment,
      message: 'Assignment created and queued for generation',
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check Redis cache
    const cached = await redis.get(`assignment:${id}`);
    if (cached) {
      const data = JSON.parse(cached);
      return res.json({ success: true, data, cached: true });
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    if (assignment.status === 'completed') {
      await redis.setex(`assignment:${id}`, 3600, JSON.stringify(assignment));
    }

    return res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

export const regenerateAssignment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    if (assignment.status === 'processing') {
      return res.status(409).json({ success: false, message: 'Assignment is already being processed' });
    }

    await Assignment.findByIdAndUpdate(id, {
      status: 'pending',
      generatedPaper: undefined,
      error: undefined,
    });

    await redis.del(`assignment:${id}`);
    await addAssignmentJob(id);

    logger.info(`🔄 Assignment queued for regeneration: ${id}`);

    return res.json({ success: true, message: 'Assignment queued for regeneration' });
  } catch (error) {
    next(error);
  }
};

export const listAssignments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).limit(20).select('-generatedPaper');
    return res.json({ success: true, data: assignments });
  } catch (error) {
    next(error);
  }
};