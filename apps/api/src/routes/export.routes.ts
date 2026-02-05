import { Router } from 'express';
import * as exportController from '../controllers/export.controller';

const router = Router();

router.post('/full', exportController.fullExport);
router.post('/summary', exportController.healthSummary);
router.post('/symptoms', exportController.symptomsExport);

export default router;
