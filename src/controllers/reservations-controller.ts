import { Request, Response, NextFunction, query } from 'express';

import {
  addReservationService,
  getReservations,
} from '../services/reservations-service';

export const addReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  try {
    const user = res.locals.user;
    const reservation = await addReservationService({
      ...data,
      userId: user.id,
    });

    return res.status(200).json({
      status: 'success',
      reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservationsByQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { listingId, userId, authordId } = req.params;

    const reservations = await getReservations({
      listingId,
      userId,
      authordId,
    });

    return res.status(200).json({
      status: 'success',
      reservations,
    });
  } catch (error) {
    next(error);
  }
};
