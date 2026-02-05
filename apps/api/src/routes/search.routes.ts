import { Router } from 'express';
import * as searchController from '../controllers/search.controller';

const router = Router();

router.get('/', searchController.search);
router.post('/save', searchController.saveSearch);
router.get('/saved', searchController.getSavedSearches);
router.delete('/saved/:id', searchController.deleteSavedSearch);

export default router;
