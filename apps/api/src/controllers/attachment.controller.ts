import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import * as attachmentService from '../services/attachment.service';
import { sendSuccess } from '../utils/response.utils';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10); // 5MB

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const dir = path.join(process.cwd(), UPLOAD_DIR, req.userId!);
    if (!require('fs').existsSync(dir)) require('fs').mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|webp/i;
    const ext = path.extname(file.originalname).slice(1);
    if (allowed.test(ext) || allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
}).single('file');

export async function uploadAttachment(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new Error('No file uploaded');
    const { entityType, entityId, description } = req.body;
    const attachment = await attachmentService.uploadAttachment(
      req.userId!,
      req.file,
      entityType || 'general',
      entityId,
      description
    );
    sendSuccess(res, attachment, 'File uploaded', 201);
  } catch (error) {
    next(error);
  }
}

export async function getAttachment(req: Request, res: Response, next: NextFunction) {
  try {
    const att = await attachmentService.getAttachment(req.params.id, req.userId!);
    sendSuccess(res, att);
  } catch (error) {
    next(error);
  }
}

export async function deleteAttachment(req: Request, res: Response, next: NextFunction) {
  try {
    await attachmentService.deleteAttachment(req.params.id, req.userId!);
    sendSuccess(res, null, 'Attachment deleted');
  } catch (error) {
    next(error);
  }
}

export async function getEntityAttachments(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, id } = req.params;
    const attachments = await attachmentService.getEntityAttachments(
      type,
      id,
      req.userId!
    );
    sendSuccess(res, attachments);
  } catch (error) {
    next(error);
  }
}
