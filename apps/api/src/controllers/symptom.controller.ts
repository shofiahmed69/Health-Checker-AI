import { Request, Response, NextFunction } from 'express';
import * as symptomService from '../services/symptom.service';
import { sendSuccess, sendPaginated } from '../utils/response.utils';

export async function getSymptoms(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const search = req.query.search as string | undefined;

    const { symptoms, total } = await symptomService.getSymptoms(req.userId!, {
      page,
      limit,
      startDate,
      endDate,
      search,
    });
    sendPaginated(res, symptoms, page, limit, total);
  } catch (error) {
    next(error);
  }
}

export async function getSymptomById(req: Request, res: Response, next: NextFunction) {
  try {
    const symptom = await symptomService.getSymptomById(req.params.id, req.userId!);
    sendSuccess(res, symptom);
  } catch (error) {
    next(error);
  }
}

export async function createSymptom(req: Request, res: Response, next: NextFunction) {
  try {
    const symptom = await symptomService.createSymptom(req.userId!, req.body);
    sendSuccess(res, symptom, 'Symptom logged', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateSymptom(req: Request, res: Response, next: NextFunction) {
  try {
    const symptom = await symptomService.updateSymptom(req.params.id, req.userId!, req.body);
    sendSuccess(res, symptom, 'Symptom updated');
  } catch (error) {
    next(error);
  }
}

export async function deleteSymptom(req: Request, res: Response, next: NextFunction) {
  try {
    await symptomService.deleteSymptom(req.params.id, req.userId!);
    sendSuccess(res, null, 'Symptom deleted');
  } catch (error) {
    next(error);
  }
}

export async function getTags(req: Request, res: Response, next: NextFunction) {
  try {
    const tags = await symptomService.getSymptomTags(req.userId!);
    sendSuccess(res, tags);
  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const startDate = new Date((req.query.startDate as string) || Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = new Date((req.query.endDate as string) || Date.now());
    const analytics = await symptomService.getSymptomAnalytics(
      req.userId!,
      startDate,
      endDate
    );
    sendSuccess(res, analytics);
  } catch (error) {
    next(error);
  }
}

export async function getCalendar(req: Request, res: Response, next: NextFunction) {
  try {
    const startDate = new Date((req.query.startDate as string) || new Date().toISOString().slice(0, 10));
    const endDate = new Date((req.query.endDate as string) || startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    const data = await symptomService.getSymptomCalendar(
      req.userId!,
      startDate,
      endDate
    );
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
}
