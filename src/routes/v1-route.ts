import { Router } from 'express';

import authenticationRoute from './authentication-route';
import usersRoute from './users-route';
import listingsRoute from './listings-route';

const router = Router();

router.use('/auth', authenticationRoute);
router.use('/users', usersRoute);
router.use('/listings', listingsRoute);

export default router;
