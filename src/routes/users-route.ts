import { Router } from 'express';
import { getCurrentUser } from '../controllers/users-controller';
import { deserializeUser } from '../middlewares/deserialize-user-middleware';
import { requireUser } from '../middlewares/require-user-middleware';

const router = Router();

router.use(deserializeUser);

router.get('/me', getCurrentUser);

export default router;
