import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  refreshAccessTokenController,
  registerUserController,
} from '../controllers/authentication-controller';
import { validate } from '../middlewares/validate-middleware';
import { createUserSchema, loginUserSchema } from '../schemas/user-schema';

const router = Router();

router.post('/register', validate(createUserSchema), registerUserController);
router.post('/login', validate(loginUserSchema), loginUserController);
router.post('/logout', logoutUserController);
router.get('/refresh', refreshAccessTokenController);

export default router;
