import { NextFunction, Request, Response } from 'express';

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token or session has expired, Please login!',
      });
    }

    next();
  } catch (err: any) {
    next(err);
  }
};
