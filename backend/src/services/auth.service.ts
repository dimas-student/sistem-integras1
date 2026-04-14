import bcryptjs from 'bcryptjs';
import { prisma } from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import type { AuthResponse } from '../types/index.js';

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResponse> {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const passwordHash = await bcryptjs.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      role: 'LEARNER',
    },
  });

  const accessToken = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const passwordMatch = await bcryptjs.compare(password, user.passwordHash);

  if (!passwordMatch) {
    throw new Error('Invalid email or password');
  }

  const accessToken = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });
}
