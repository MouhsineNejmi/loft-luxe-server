import { Router } from 'express';

import authenticationRoute from './authentication-route';
import usersRoute from './users-route';
import listingsRoute from './listings-route';
import reservationsRoute from './reservations-route';

const router = Router();

router.use('/auth', authenticationRoute);
router.use('/users', usersRoute);
router.use('/listings', listingsRoute);
router.use('/reservations', reservationsRoute);

export default router;
