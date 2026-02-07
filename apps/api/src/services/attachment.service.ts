import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

export async function uploadAttachment(
  userId: string,
  file: Express.Multer.File,
  entityType: string,
  entityId?: string,
  description?: string
) {
  const dir = path.join(UPLOAD_DIR, userId);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const fileName = file.filename;
  const filePath = path.join(userId, fileName);

  const attachment = await prisma.attachment.create({
    data: {
      userId,
      entityType,
      entityId,
      fileName,
      filePath,
      fileType: file.mimetype,
      fileSize: BigInt(file.size),
      description,
    },
  });

  return attachment;
}

export async function getAttachment(id: string, userId: string) {
  const att = await prisma.attachment.findFirst({
    where: { id, userId },
  });
  if (!att) throw new AppError('Attachment not found', 404);
  return att;
}

export async function deleteAttachment(id: string, userId: string) {
  const att = await prisma.attachment.findFirst({
    where: { id, userId },
  });
  if (!att) throw new AppError('Attachment not found', 404);
  const fullPath = path.join(UPLOAD_DIR, att.filePath);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  return prisma.attachment.delete({ where: { id } });
}

export async function getEntityAttachments(entityType: string, entityId: string, userId: string) {
  return prisma.attachment.findMany({
    where: { userId, entityType, entityId },
  });
}
