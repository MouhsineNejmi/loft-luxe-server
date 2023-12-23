export default class AppError extends Error {
  status: string;
  isOperational: boolean;

  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.status = 'fail';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
