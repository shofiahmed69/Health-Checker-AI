import { Router } from 'express';
import * as symptomController from '../controllers/symptom.controller';

const router = Router();

router.get('/', symptomController.getSymptoms);
router.get('/tags', symptomController.getTags);
router.get('/analytics', symptomController.getAnalytics);
router.get('/calendar', symptomController.getCalendar);
router.get('/:id', symptomController.getSymptomById);
router.post('/', symptomController.createSymptom);
router.put('/:id', symptomController.updateSymptom);
router.delete('/:id', symptomController.deleteSymptom);

export default router;
