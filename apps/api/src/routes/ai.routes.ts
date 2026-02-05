import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';

const router = Router();

router.get('/health', aiController.health);
router.get('/insights', aiController.getInsights);
router.post('/patterns', aiController.analyzePatterns);
router.post('/appointment-prep', aiController.appointmentPrep);
router.post('/medical-summary', aiController.medicalSummary);
router.post('/chat', aiController.chat);
router.post('/suggestions', aiController.suggestions);

export default router;
