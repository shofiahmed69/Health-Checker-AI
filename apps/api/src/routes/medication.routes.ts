import { Router } from 'express';
import * as medicationController from '../controllers/medication.controller';

const router = Router();

router.get('/', medicationController.getMedications);
router.get('/schedule', medicationController.getSchedule);
router.get('/analytics', medicationController.getAnalytics);
router.get('/:id', medicationController.getMedicationById);
router.get('/:id/logs', medicationController.getMedicationLogs);
router.post('/', medicationController.createMedication);
router.post('/:id/logs', medicationController.logMedication);
router.put('/:id', medicationController.updateMedication);
router.delete('/:id', medicationController.deleteMedication);

export default router;
