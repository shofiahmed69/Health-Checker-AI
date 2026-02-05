import { Request, Response, NextFunction } from 'express';
import * as trackerService from '../services/tracker.service';
import { sendSuccess } from '../utils/response.utils';

export async function getTrackers(req: Request, res: Response, next: NextFunction) {
  try {
    const trackers = await trackerService.getTrackers(req.userId!);
    sendSuccess(res, trackers);
  } catch (error) {
    next(error);
  }
}

export async function createTracker(req: Request, res: Response, next: NextFunction) {
  try {
    const tracker = await trackerService.createTracker(req.userId!, req.body);
    sendSuccess(res, tracker, 'Tracker created', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateTracker(req: Request, res: Response, next: NextFunction) {
  try {
    const tracker = await trackerService.updateTracker(
      req.params.id,
      req.userId!,
      req.body
    );
    sendSuccess(res, tracker, 'Tracker updated');
  } catch (error) {
    next(error);
  }
}

export async function deleteTracker(req: Request, res: Response, next: NextFunction) {
  try {
    await trackerService.deleteTracker(req.params.id, req.userId!);
    sendSuccess(res, null, 'Tracker deleted');
  } catch (error) {
    next(error);
  }
}

export async function getLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await trackerService.getTrackerLogs(req.params.id, req.userId!);
    sendSuccess(res, logs);
  } catch (error) {
    next(error);
  }
}

export async function createLog(req: Request, res: Response, next: NextFunction) {
  try {
    const log = await trackerService.createTrackerLog(
      req.params.id,
      req.userId!,
      req.body
    );
    sendSuccess(res, log, 'Log created', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateLog(req: Request, res: Response, next: NextFunction) {
  try {
    const log = await trackerService.updateTrackerLog(
      req.params.logId,
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
    await trackerService.deleteTrackerLog(req.params.logId, req.userId!);
    sendSuccess(res, null, 'Log deleted');
  } catch (error) {
    next(error);
  }
}
