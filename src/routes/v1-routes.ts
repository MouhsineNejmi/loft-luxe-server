import { Router } from 'express';

import authenticationRoutes from './authentication-routes';
import usersRoutes from './users-routes';

const router = Router();

router.use('/auth', authenticationRoutes);
router.use('/users', usersRoutes);

export default router;
