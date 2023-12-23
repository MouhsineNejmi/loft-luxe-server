import { Request, Response, NextFunction } from 'express';

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  return res.status(200).json({
    status: 'success',
    user,
  });
};
