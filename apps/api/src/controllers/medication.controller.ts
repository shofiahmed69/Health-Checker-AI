import { Request, Response, NextFunction } from 'express';
import * as medicationService from '../services/medication.service';
import { sendSuccess } from '../utils/response.utils';

export async function getMedications(req: Request, res: Response, next: NextFunction) {
  try {
    const activeOnly = req.query.active === 'true';
    const medications = await medicationService.getMedications(req.userId!, activeOnly);
    sendSuccess(res, medications);
  } catch (error) {
    next(error);
  }
}

export async function getMedicationById(req: Request, res: Response, next: NextFunction) {
  try {
    const medication = await medicationService.getMedicationById(req.params.id, req.userId!);
    sendSuccess(res, medication);
  } catch (error) {
    next(error);
  }
}

export async function createMedication(req: Request, res: Response, next: NextFunction) {
  try {
    const medication = await medicationService.createMedication(req.userId!, req.body);
    sendSuccess(res, medication, 'Medication added', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateMedication(req: Request, res: Response, next: NextFunction) {
  try {
    const medication = await medicationService.updateMedication(
      req.params.id,
      req.userId!,
      req.body
    );
    sendSuccess(res, medication, 'Medication updated');
  } catch (error) {
    next(error);
  }
}

export async function deleteMedication(req: Request, res: Response, next: NextFunction) {
  try {
    await medicationService.deleteMedication(req.params.id, req.userId!);
    sendSuccess(res, null, 'Medication deleted');
  } catch (error) {
    next(error);
  }
}

export async function getMedicationLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await medicationService.getMedicationLogs(req.params.id, req.userId!);
    sendSuccess(res, logs);
  } catch (error) {
    next(error);
  }
}

export async function logMedication(req: Request, res: Response, next: NextFunction) {
  try {
    const log = await medicationService.logMedication(
      req.params.id,
      req.userId!,
      req.body
    );
    sendSuccess(res, log, 'Medication logged', 201);
  } catch (error) {
    next(error);
  }
}

export async function getSchedule(req: Request, res: Response, next: NextFunction) {
  try {
    const schedule = await medicationService.getTodaySchedule(req.userId!);
    sendSuccess(res, schedule);
  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const analytics = await medicationService.getAdherenceAnalytics(req.userId!, days);
    sendSuccess(res, analytics);
  } catch (error) {
    next(error);
  }
}
