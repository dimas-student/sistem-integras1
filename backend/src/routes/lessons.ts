import { Router, type Request, type Response } from 'express';
import { prisma } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, roleMiddleware(['INSTRUCTOR', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const { courseId, title, description, contentUrl, duration } = req.body;

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title,
        description,
        contentUrl,
        duration: duration || 0,
        order: 1,
      },
    });

    sendSuccess(res, lesson, 'Lesson created', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.get('/course/:courseId', async (req: Request, res: Response) => {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { courseId: req.params.courseId },
      orderBy: { order: 'asc' },
    });

    sendSuccess(res, lessons);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
    });

    if (!lesson) {
      return sendError(res, 'Lesson not found', 404);
    }

    sendSuccess(res, lesson);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.put('/:id', authMiddleware, roleMiddleware(['INSTRUCTOR', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const lesson = await prisma.lesson.update({
      where: { id: req.params.id },
      data: req.body,
    });

    sendSuccess(res, lesson, 'Lesson updated');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

export default router;
