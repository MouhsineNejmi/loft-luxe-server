import { Router } from 'express';
import {
  loginUserController,
  refreshAccessTokenController,
  registerUserController,
} from '../controllers/authentication-controller';
import { validate } from '../middlewares/validate-middleware';
import { createUserSchema, loginUserSchema } from '../schemas/user-schema';

const router = Router();

router.post('/register', validate(createUserSchema), registerUserController);
router.post('/login', validate(loginUserSchema), loginUserController);
router.get('/refresh', refreshAccessTokenController);

export default router;
