import { NextFunction, Request, Response } from 'express';

export const restrictTo =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not allowed to perform this action',
      });
    }

    next();
  };
