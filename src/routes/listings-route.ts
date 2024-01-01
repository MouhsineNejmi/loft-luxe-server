import { Router } from 'express';
import {
  addListing,
  getAllListings,
  getFavoriteListings,
  getListingById,
  deleteListing,
} from '../controllers/listings-controller';

import { deserializeUser } from '../middlewares/deserialize-user-middleware';
import { requireUser } from '../middlewares/require-user-middleware';
import { validate } from '../middlewares/validate-middleware';

import { addListingSchema } from '../schemas/listing-schema';

const router = Router();

router.use(deserializeUser);

router.get('/', getAllListings);
router.get('/favorites', requireUser, getFavoriteListings);
router.get('/:listingId', getListingById);

router.post('/', validate(addListingSchema), addListing);
router.delete('/:listingId', requireUser, deleteListing);

export default router;
