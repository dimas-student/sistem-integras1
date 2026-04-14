import { Router, type Request, type Response } from 'express';
import {
  createQuiz,
  getQuizById,
  getCourseQuizzes,
  addQuestionToQuiz,
  submitQuizAttempt,
  getUserQuizAttempts,
} from '../services/quiz.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, roleMiddleware(['INSTRUCTOR', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const { courseId, title, description } = req.body;
    const quiz = await createQuiz(courseId, title, description);
    sendSuccess(res, quiz, 'Quiz created', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const quiz = await getQuizById(req.params.id);
    if (!quiz) {
      return sendError(res, 'Quiz not found', 404);
    }
    sendSuccess(res, quiz);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.get('/course/:courseId', async (req: Request, res: Response) => {
  try {
    const quizzes = await getCourseQuizzes(req.params.courseId);
    sendSuccess(res, quizzes);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.post('/:quizId/questions', authMiddleware, roleMiddleware(['INSTRUCTOR', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const { type, prompt, options, correctAnswer } = req.body;
    const question = await addQuestionToQuiz(req.params.quizId, type, prompt, options, correctAnswer);
    sendSuccess(res, question, 'Question added', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.post('/:quizId/submit', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { responses } = req.body;
    const attempt = await submitQuizAttempt(req.user!.id, req.params.quizId, responses);
    sendSuccess(res, attempt, 'Quiz submitted', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.get('/:quizId/attempts', authMiddleware, async (req: Request, res: Response) => {
  try {
    const attempts = await getUserQuizAttempts(req.user!.id, req.params.quizId);
    sendSuccess(res, attempts);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

export default router;
