import { Request, Response, NextFunction } from 'express';
import {
  addListingService,
  listAllListings,
  listFavoriteListings,
  listingById,
  removeListing,
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
  console.log('Query: ', req.query);

  const listings = await listAllListings(req.query);

  console.log('listings controller: ', listings);

  return res.status(200).json({
    status: 'success',
    listings,
  });
};

export const getListingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { listingId } = req.params;

  try {
    const listing = await listingById(listingId);

    return res.status(200).json({
      status: 'success',
      listing,
    });
  } catch (error) {
    next(error);
  }
};

export const getFavoriteListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    const listings = await listFavoriteListings(user);

    return res.status(200).json({
      status: 'success',
      listings,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { listingId } = req.params;

    const listings = await removeListing(listingId);

    return res.status(200).json({
      status: 'success',
      listings,
    });
  } catch (error) {
    next(error);
  }
};
