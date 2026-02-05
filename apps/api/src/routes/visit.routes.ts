import { Router } from 'express';
import * as visitController from '../controllers/visit.controller';

const router = Router();

router.get('/', visitController.getVisits);
router.get('/upcoming', visitController.getUpcoming);
router.get('/:id', visitController.getVisitById);
router.post('/', visitController.createVisit);
router.post('/:id/symptoms', visitController.linkSymptoms);
router.put('/:id', visitController.updateVisit);
router.delete('/:id', visitController.deleteVisit);

export default router;
