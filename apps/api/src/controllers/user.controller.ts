import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { sendSuccess } from '../utils/response.utils';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getProfile(req.userId!);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.updateProfile(req.userId!, req.body);
    sendSuccess(res, user, 'Profile updated');
  } catch (error) {
    next(error);
  }
}

export async function getEmergencyContacts(req: Request, res: Response, next: NextFunction) {
  try {
    const contacts = await userService.getEmergencyContacts(req.userId!);
    sendSuccess(res, contacts);
  } catch (error) {
    next(error);
  }
}

export async function addEmergencyContact(req: Request, res: Response, next: NextFunction) {
  try {
    const contact = await userService.addEmergencyContact(req.userId!, req.body);
    sendSuccess(res, contact, 'Contact added', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateEmergencyContact(req: Request, res: Response, next: NextFunction) {
  try {
    const contact = await userService.updateEmergencyContact(
      req.params.id,
      req.userId!,
      req.body
    );
    sendSuccess(res, contact, 'Contact updated');
  } catch (error) {
    next(error);
  }
}

export async function deleteEmergencyContact(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.deleteEmergencyContact(req.params.id, req.userId!);
    sendSuccess(res, null, 'Contact deleted');
  } catch (error) {
    next(error);
  }
}
