import { Router, type Request, type Response } from 'express';
import { prisma } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, roleMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    sendSuccess(res, users);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, user);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

router.patch('/:id/role', authMiddleware, roleMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { role } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    sendSuccess(res, user, 'User role updated');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
});

export default router;
