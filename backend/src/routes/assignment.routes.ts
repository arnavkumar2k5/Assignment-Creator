import { Router } from 'express';
import {
  createAssignment,
  getAssignment,
  regenerateAssignment,
  listAssignments,
} from '../controllers/assignment.controller';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', listAssignments);
router.post('/', upload.single('file'), createAssignment);
router.get('/:id', getAssignment);
router.post('/:id/regenerate', regenerateAssignment);

export default router;
