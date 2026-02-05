import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    profilePictureUrl: string | null;
  };
  token: string;
  expiresIn: string;
}

export async function register(data: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError('User with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  });

  const token = generateToken(user.id, user.email);
  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePictureUrl: user.profilePictureUrl,
    },
    token,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  };
}

export async function login(data: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user.id, user.email);
  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePictureUrl: user.profilePictureUrl,
    },
    token,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  };
}

function generateToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET || 'fallback-secret-change-me';
  return jwt.sign(
    { userId, email },
    secret,
    { expiresIn: '7d' }
  );
}
