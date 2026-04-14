import { Router, type Request, type Response } from 'express';
import { registerUser, loginUser, getUserById } from '../services/auth.service.js';
import { validateRegistrationInput, validateLoginInput } from '../utils/validators.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const { valid, errors } = validateRegistrationInput(email, password, firstName, lastName);
    if (!valid) {
      return sendError(res, errors.join(', '), 400);
    }

    const result = await registerUser(email, password, firstName, lastName);
    sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { valid, errors } = validateLoginInput(email, password);
    if (!valid) {
      return sendError(res, errors.join(', '), 400);
    }

    const result = await loginUser(email, password);
    sendSuccess(res, result, 'Login successful', 200);
  } catch (error: any) {
    sendError(res, error.message, 401);
  }
});

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.user!.id);
    sendSuccess(res, user, 'User fetched successfully');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

export default router;
