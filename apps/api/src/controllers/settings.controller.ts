import { Request, Response, NextFunction } from 'express';
import * as settingsService from '../services/settings.service';
import { sendSuccess } from '../utils/response.utils';

export async function getPreferences(req: Request, res: Response, next: NextFunction) {
  try {
    const prefs = await settingsService.getPreferences(req.userId!);
    sendSuccess(res, prefs);
  } catch (error) {
    next(error);
  }
}

export async function updatePreferences(req: Request, res: Response, next: NextFunction) {
  try {
    const prefs = await settingsService.updatePreferences(req.userId!, req.body);
    sendSuccess(res, prefs, 'Preferences updated');
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(req: Request, res: Response, next: NextFunction) {
  try {
    await settingsService.deleteAccount(req.userId!);
    sendSuccess(res, null, 'Account deleted');
  } catch (error) {
    next(error);
  }
}
