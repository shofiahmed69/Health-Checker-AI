import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/emergency-contacts', userController.getEmergencyContacts);
router.post('/emergency-contacts', userController.addEmergencyContact);
router.put('/emergency-contacts/:id', userController.updateEmergencyContact);
router.delete('/emergency-contacts/:id', userController.deleteEmergencyContact);

export default router;
