import { Request, Response, NextFunction } from "express";
import {
  addListingToFavorites,
  removeListingFromFavorites,
} from "../services/users-service";

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  return res.status(200).json({
    status: "success",
    user,
  });
};

export const addToFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { listingId } = req.params;
  const currentUser = res.locals.user;

  try {
    if (!listingId || typeof listingId !== "string") {
      return res.status(400).json({
        status: "fail",
        message: "Invalid ID",
      });
    }

    const user = await addListingToFavorites(currentUser, listingId);

    return res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { listingId } = req.params;
  const currentUser = res.locals.user;

  try {
    if (!listingId || typeof listingId !== "string") {
      return res.status(400).json({
        status: "fail",
        message: "Invalid ID",
      });
    }

    const user = await removeListingFromFavorites(currentUser, listingId);

    return res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    next(error);
  }
};
