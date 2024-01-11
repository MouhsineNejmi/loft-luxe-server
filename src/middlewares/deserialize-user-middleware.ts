import { NextFunction, Request, Response } from 'express';
import { findUserById } from '../services/users-service';
import { verifyJwt } from '../utils/jwt';

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not logged in',
      });
    }

    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      `${process.env.ACCESS_TOKEN_KEY}`
    );

    if (!decoded) {
      return res.status(401).json({
        status: 'fail',
        message: "Invalid token or user doesn't exist",
      });
    }

    const user = await findUserById(decoded.sub);

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User with that token no longer exist',
      });
    }

    res.locals.user = user;

    next();
  } catch (err: any) {
    next(err);
  }
};
