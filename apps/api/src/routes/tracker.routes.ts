import { Router } from 'express';
import * as trackerController from '../controllers/tracker.controller';

const router = Router();

router.get('/', trackerController.getTrackers);
router.post('/', trackerController.createTracker);
router.put('/:id', trackerController.updateTracker);
router.delete('/:id', trackerController.deleteTracker);
router.get('/:id/logs', trackerController.getLogs);
router.post('/:id/logs', trackerController.createLog);
router.put('/logs/:logId', trackerController.updateLog);
router.delete('/logs/:logId', trackerController.deleteLog);

export default router;
