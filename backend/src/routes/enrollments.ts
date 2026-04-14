import { Router, type Request, type Response } from 'express';
import {
  enrollUserInCourse,
  getUserEnrollments,
  getCourseEnrollments,
  updateEnrollmentStatus,
  unenrollUser,
} from '../services/enrollment.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const enrollment = await enrollUserInCourse(req.user!.id, courseId);
    sendSuccess(res, enrollment, 'Enrolled successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.get('/user/:userId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const enrollments = await getUserEnrollments(req.params.userId);
    sendSuccess(res, enrollments);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.get('/course/:courseId', authMiddleware, roleMiddleware(['INSTRUCTOR', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const enrollments = await getCourseEnrollments(req.params.courseId);
    sendSuccess(res, enrollments);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.patch('/:id/status', authMiddleware, roleMiddleware(['INSTRUCTOR', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const enrollment = await updateEnrollmentStatus(req.params.id, status);
    sendSuccess(res, enrollment, 'Status updated');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.body;
    await unenrollUser(userId, courseId);
    sendSuccess(res, null, 'Unenrolled successfully');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

export default router;
