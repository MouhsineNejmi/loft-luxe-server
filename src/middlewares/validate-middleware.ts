import { NextFunction, Request, Response } from 'express';
import { AnySchema, ValidationError } from 'yup';

export const validate =
  (schema: AnySchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.validate({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      next();
    } catch (err: any) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          status: 'fail',
          error: err.errors,
        });
      }
      next(err);
    }
  };
