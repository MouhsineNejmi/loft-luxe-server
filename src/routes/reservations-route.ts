import { Router } from 'express';
import {
  addReservation,
  getReservationsByQuery,
  cancelReservation,
} from '../controllers/reservations-controller';

import { deserializeUser } from '../middlewares/deserialize-user-middleware';
import { requireUser } from '../middlewares/require-user-middleware';
import { validate } from '../middlewares/validate-middleware';

import { addReservationSchema } from '../schemas/reservation-schema';

const router = Router();

router.use(deserializeUser, requireUser);

router.get('/', getReservationsByQuery);

router.post('/', validate(addReservationSchema), addReservation);

router.delete('/:reservationId', cancelReservation);

export default router;
