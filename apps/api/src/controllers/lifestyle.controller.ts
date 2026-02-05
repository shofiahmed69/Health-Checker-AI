import { Request, Response, NextFunction } from 'express';
import * as lifestyleService from '../services/lifestyle.service';
import { sendSuccess } from '../utils/response.utils';

export async function getLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const startDate = new Date((req.query.startDate as string) || Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = new Date((req.query.endDate as string) || Date.now());
    const logs = await lifestyleService.getLifestyleLogs(
      req.userId!,
      startDate,
      endDate
    );
    sendSuccess(res, logs);
  } catch (error) {
    next(error);
  }
}

export async function getByDate(req: Request, res: Response, next: NextFunction) {
  try {
    const date = new Date(req.params.date);
    const log = await lifestyleService.getLogByDate(req.userId!, date);
    sendSuccess(res, log || {});
  } catch (error) {
    next(error);
  }
}

export async function createLog(req: Request, res: Response, next: NextFunction) {
  try {
    const log = await lifestyleService.createLifestyleLog(req.userId!, req.body);
    sendSuccess(res, log, 'Log created', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateLog(req: Request, res: Response, next: NextFunction) {
  try {
    const log = await lifestyleService.updateLifestyleLog(
      req.params.id,
      req.userId!,
      req.body
    );
    sendSuccess(res, log, 'Log updated');
  } catch (error) {
    next(error);
  }
}

export async function deleteLog(req: Request, res: Response, next: NextFunction) {
  try {
    await lifestyleService.deleteLifestyleLog(req.params.id, req.userId!);
    sendSuccess(res, null, 'Log deleted');
  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const analytics = await lifestyleService.getLifestyleAnalytics(req.userId!, days);
    sendSuccess(res, analytics);
  } catch (error) {
    next(error);
  }
}
