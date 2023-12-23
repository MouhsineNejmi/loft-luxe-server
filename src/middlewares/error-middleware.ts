import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, req: Request, res: Response) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default errorMiddleware;
