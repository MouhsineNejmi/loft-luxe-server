import { Router } from 'express';

import {
  addToFavorites,
  getCurrentUser,
  removeFromFavorites,
} from '../controllers/users-controller';

import { deserializeUser } from '../middlewares/deserialize-user-middleware';
import { requireUser } from '../middlewares/require-user-middleware';

const router = Router();

router.use(deserializeUser);

router.get('/me', getCurrentUser);

router.use(requireUser);
router.post('/favorites/:listingId', addToFavorites);
router.delete('/favorites/:listingId', removeFromFavorites);

export default router;
