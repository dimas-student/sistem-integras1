import { Router, type Request, type Response } from 'express';
import { prisma } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { courseId, assignmentTitle, fileUrl } = req.body;

    const submission = await prisma.submission.create({
      data: {
        userId: req.user!.id,
        courseId,
        assignmentTitle,
        fileUrl,
      },
    });

    sendSuccess(res, submission, 'Submission created', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.get('/course/:courseId', authMiddleware, roleMiddleware(['INSTRUCTOR', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.submission.findMany({
      where: { courseId: req.params.courseId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    sendSuccess(res, submissions);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.patch('/:id/grade', authMiddleware, roleMiddleware(['INSTRUCTOR', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const { grade, feedback } = req.body;

    const submission = await prisma.submission.update({
      where: { id: req.params.id },
      data: { grade, feedback },
    });

    sendSuccess(res, submission, 'Submission graded');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

export default router;
