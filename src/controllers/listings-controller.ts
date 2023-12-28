import { Request, Response, NextFunction } from 'express';
import {
  addListingService,
  listAllListings,
} from '../services/listings-service';

export const addListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  try {
    const user = res.locals.user;
    const listing = await addListingService({ ...data, userId: user.id });

    return res.status(200).json({
      status: 'success',
      listing,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const listings = await listAllListings();

  return res.status(200).json({
    status: 'success',
    listings,
  });
};
