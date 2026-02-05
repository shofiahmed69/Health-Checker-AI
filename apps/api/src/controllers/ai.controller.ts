import { Request, Response, NextFunction } from 'express';
import * as aiService from '../services/ai.service';
import { sendSuccess } from '../utils/response.utils';
import { isOllamaAvailable } from '../services/ollama.service';

export async function analyzePatterns(req: Request, res: Response, next: NextFunction) {
  try {
    const available = await isOllamaAvailable();
    if (!available) {
      return res.status(503).json({
        success: false,
        message: 'Ollama is not running. Start Ollama and pull llama3.2 model.',
      });
    }
    const result = await aiService.analyzePatterns(req.userId!, req.body?.dateRange);
    sendSuccess(res, { insight: result });
  } catch (error) {
    next(error);
  }
}

export async function appointmentPrep(req: Request, res: Response, next: NextFunction) {
  try {
    const available = await isOllamaAvailable();
    if (!available) {
      return res.status(503).json({
        success: false,
        message: 'Ollama is not running. Start Ollama and pull llama3.2 model.',
      });
    }
    const result = await aiService.generateAppointmentPrep(
      req.userId!,
      req.body?.visitId,
      req.body?.dateRange
    );
    sendSuccess(res, { summary: result });
  } catch (error) {
    next(error);
  }
}

export async function medicalSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const available = await isOllamaAvailable();
    if (!available) {
      return res.status(503).json({
        success: false,
        message: 'Ollama is not running. Start Ollama and pull llama3.2 model.',
      });
    }
    const result = await aiService.generateMedicalSummary(req.userId!, req.body);
    sendSuccess(res, { summary: result });
  } catch (error) {
    next(error);
  }
}

export async function chat(req: Request, res: Response, next: NextFunction) {
  try {
    const available = await isOllamaAvailable();
    if (!available) {
      return res.status(503).json({
        success: false,
        message: 'Ollama is not running. Start Ollama and pull llama3.2 model.',
      });
    }
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message required' });
    }
    const result = await aiService.chat(req.userId!, message);
    sendSuccess(res, { response: result });
  } catch (error) {
    next(error);
  }
}

export async function suggestions(req: Request, res: Response, next: NextFunction) {
  try {
    const available = await isOllamaAvailable();
    if (!available) {
      return res.status(503).json({
        success: false,
        message: 'Ollama is not running. Start Ollama and pull llama3.2 model.',
      });
    }
    const result = await aiService.getSuggestions(req.userId!);
    sendSuccess(res, { suggestions: result });
  } catch (error) {
    next(error);
  }
}

export async function getInsights(req: Request, res: Response, next: NextFunction) {
  try {
    const type = req.query.type as string | undefined;
    const insights = await aiService.getCachedInsights(req.userId!, type);
    sendSuccess(res, insights);
  } catch (error) {
    next(error);
  }
}

export async function health(req: Request, res: Response) {
  const available = await isOllamaAvailable();
  sendSuccess(res, { ollama: available });
}
