import { Router } from 'express';
import * as attachmentController from '../controllers/attachment.controller';

const router = Router();

router.post('/', attachmentController.upload, attachmentController.uploadAttachment);
router.get('/entity/:type/:id', attachmentController.getEntityAttachments);
router.get('/:id', attachmentController.getAttachment);
router.get('/:id/download', attachmentController.downloadFile);
router.delete('/:id', attachmentController.deleteAttachment);

export default router;
