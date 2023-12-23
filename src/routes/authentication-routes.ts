import { Router } from 'express';
import {
  loginUserController,
  registerUserController,
} from '../controllers/authentication-controller';
import { validate } from '../middlewares/validate-middleware';
import { createUserSchema, loginUserSchema } from '../schemas/user-schema';

const router = Router();

router.post('/register', validate(createUserSchema), registerUserController);
router.post('/login', validate(loginUserSchema), loginUserController);

export default router;
