import { Request, Response, NextFunction } from 'express';
import * as visitService from '../services/visit.service';
import { sendSuccess } from '../utils/response.utils';

export async function getVisits(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const visits = await visitService.getVisits(req.userId!, limit);
    sendSuccess(res, visits);
  } catch (error) {
    next(error);
  }
}

export async function getVisitById(req: Request, res: Response, next: NextFunction) {
  try {
    const visit = await visitService.getVisitById(req.params.id, req.userId!);
    sendSuccess(res, visit);
  } catch (error) {
    next(error);
  }
}

export async function createVisit(req: Request, res: Response, next: NextFunction) {
  try {
    const visit = await visitService.createVisit(req.userId!, req.body);
    sendSuccess(res, visit, 'Visit logged', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateVisit(req: Request, res: Response, next: NextFunction) {
  try {
    const visit = await visitService.updateVisit(req.params.id, req.userId!, req.body);
    sendSuccess(res, visit, 'Visit updated');
  } catch (error) {
    next(error);
  }
}

export async function deleteVisit(req: Request, res: Response, next: NextFunction) {
  try {
    await visitService.deleteVisit(req.params.id, req.userId!);
    sendSuccess(res, null, 'Visit deleted');
  } catch (error) {
    next(error);
  }
}

export async function getUpcoming(req: Request, res: Response, next: NextFunction) {
  try {
    const visits = await visitService.getUpcomingVisits(req.userId!);
    sendSuccess(res, visits);
  } catch (error) {
    next(error);
  }
}

export async function linkSymptoms(req: Request, res: Response, next: NextFunction) {
  try {
    const { symptomIds } = req.body;
    const visit = await visitService.linkSymptomsToVisit(
      req.params.id,
      req.userId!,
      Array.isArray(symptomIds) ? symptomIds : []
    );
    sendSuccess(res, visit, 'Symptoms linked');
  } catch (error) {
    next(error);
  }
}
