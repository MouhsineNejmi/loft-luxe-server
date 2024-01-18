import { Request, Response, NextFunction, query } from "express";

import {
  addReservationService,
  getReservations,
  deleteReservation,
} from "../services/reservations-service";
import { error } from "console";

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
      status: "success",
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
    const { listingId, userId, authorId } = req.query;

    const reservations = await getReservations({
      listingId,
      userId,
      authorId,
    });

    return res.status(200).json({
      status: "success",
      reservations,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reservationId } = req.params;
    const currentUser = res.locals.user;

    if (!currentUser) {
      return next(error);
    }

    if (!reservationId) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid ID",
      });
    }

    const reservation = await deleteReservation(reservationId, currentUser);

    return res.status(200).json({
      status: "success",
      reservation,
    });
  } catch (error) {
    next(error);
  }
};
