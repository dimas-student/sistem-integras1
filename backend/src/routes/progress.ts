import { Router, type Request, type Response } from 'express';
import {
  updateLessonProgress,
  getUserCourseProgress,
  getLessonProgress,
} from '../services/progress.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { lessonId, viewedDuration, isCompleted } = req.body;
    const progress = await updateLessonProgress(req.user!.id, lessonId, viewedDuration, isCompleted);
    sendSuccess(res, progress, 'Progress updated', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.get('/course/:courseId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const progress = await getUserCourseProgress(req.user!.id, req.params.courseId);
    sendSuccess(res, progress);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.get('/lesson/:lessonId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const progress = await getLessonProgress(req.user!.id, req.params.lessonId);
    sendSuccess(res, progress);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

export default router;
