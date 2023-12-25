import { Router } from 'express';
import { addListing } from '../controllers/listings-controller';

import { deserializeUser } from '../middlewares/deserialize-user-middleware';
import { requireUser } from '../middlewares/require-user-middleware';
import { validate } from '../middlewares/validate-middleware';

import { addListingSchema } from '../schemas/listing-schema';

const router = Router();

router.use(deserializeUser, requireUser);

router.post('/', validate(addListingSchema), addListing);

export default router;
