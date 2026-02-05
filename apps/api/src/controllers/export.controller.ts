import { Request, Response, NextFunction } from 'express';
import * as exportService from '../services/export.service';
import { sendSuccess } from '../utils/response.utils';

export async function fullExport(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await exportService.exportFullData(req.userId!);
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
}

export async function healthSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const pdf = await exportService.generateHealthSummaryPDF(req.userId!);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=health-summary.pdf');
    res.send(pdf);
  } catch (error) {
    next(error);
  }
}

export async function symptomsExport(req: Request, res: Response, next: NextFunction) {
  try {
    const csv = await exportService.exportSymptomsCSV(req.userId!);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=symptoms.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
}
