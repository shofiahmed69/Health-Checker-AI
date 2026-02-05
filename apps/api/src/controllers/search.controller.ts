import { Request, Response, NextFunction } from 'express';
import * as searchService from '../services/search.service';
import { sendSuccess } from '../utils/response.utils';

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const q = (req.query.q as string) || '';
    const category = req.query.category as string | undefined;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const filters = { category, startDate, endDate };
    const results = await searchService.globalSearch(req.userId!, q, filters);
    sendSuccess(res, results);
  } catch (error) {
    next(error);
  }
}

export async function saveSearch(req: Request, res: Response, next: NextFunction) {
  try {
    const { searchName, searchQuery, filters } = req.body;
    const saved = await searchService.saveSearch(
      req.userId!,
      searchName,
      searchQuery || '',
      filters
    );
    sendSuccess(res, saved, 'Search saved', 201);
  } catch (error) {
    next(error);
  }
}

export async function getSavedSearches(req: Request, res: Response, next: NextFunction) {
  try {
    const searches = await searchService.getSavedSearches(req.userId!);
    sendSuccess(res, searches);
  } catch (error) {
    next(error);
  }
}

export async function deleteSavedSearch(req: Request, res: Response, next: NextFunction) {
  try {
    await searchService.deleteSavedSearch(req.params.id, req.userId!);
    sendSuccess(res, null, 'Search deleted');
  } catch (error) {
    next(error);
  }
}
