import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller';

const router = Router();

router.get('/preferences', settingsController.getPreferences);
router.put('/preferences', settingsController.updatePreferences);
router.delete('/account', settingsController.deleteAccount);

export default router;
