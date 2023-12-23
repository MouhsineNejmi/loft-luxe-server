import { Router } from 'express';

import authenticationRoutes from './authentication-routes';

const router = Router();

router.use('/auth', authenticationRoutes);

export default router;
