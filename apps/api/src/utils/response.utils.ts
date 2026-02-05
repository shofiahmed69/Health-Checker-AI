import { Response } from 'express';

export function sendSuccess(
  res: Response,
  data: unknown,
  message?: string,
  statusCode: number = 200
) {
  res.status(statusCode).json({
    success: true,
    message: message || 'Success',
    data,
  });
}

export function sendError(res: Response, message: string, statusCode: number = 400) {
  res.status(statusCode).json({
    success: false,
    message,
  });
}

export function sendPaginated(
  res: Response,
  items: unknown[],
  page: number,
  limit: number,
  total: number
) {
  res.json({
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
