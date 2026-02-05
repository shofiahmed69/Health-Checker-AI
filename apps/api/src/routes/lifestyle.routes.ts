import { Router } from 'express';
import * as lifestyleController from '../controllers/lifestyle.controller';

const router = Router();

router.get('/', lifestyleController.getLogs);
router.get('/analytics', lifestyleController.getAnalytics);
router.get('/:date', lifestyleController.getByDate);
router.post('/', lifestyleController.createLog);
router.put('/:id', lifestyleController.updateLog);
router.delete('/:id', lifestyleController.deleteLog);

export default router;
