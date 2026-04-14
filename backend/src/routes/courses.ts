import { Router, type Request, type Response } from 'express';
import {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourse,
  deleteCourse,
  publishCourse,
} from '../services/course.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, roleMiddleware(['INSTRUCTOR', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const course = await createCourse(title, description, req.user!.id);
    sendSuccess(res, course, 'Course created', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const courses = await getAllCourses(true);
    sendSuccess(res, courses);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) {
      return sendError(res, 'Course not found', 404);
    }
    sendSuccess(res, course);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.put('/:id', authMiddleware, roleMiddleware(['INSTRUCTOR', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const course = await updateCourse(req.params.id, req.body);
    sendSuccess(res, course, 'Course updated');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.delete('/:id', authMiddleware, roleMiddleware(['INSTRUCTOR', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    await deleteCourse(req.params.id);
    sendSuccess(res, null, 'Course deleted');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.patch('/:id/publish', authMiddleware, roleMiddleware(['INSTRUCTOR', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const course = await publishCourse(req.params.id);
    sendSuccess(res, course, 'Course published');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

export default router;
