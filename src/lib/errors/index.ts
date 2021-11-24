import { Request, Response, NextFunction } from 'express';
import { env } from '../../config';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const fields = Object.keys(err.keyPattern);
  const message = `Duplicate values on fields: ${fields.join(', ')}. Please use another values!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);

  const message = `Invalid input data. ${errors.join(' ')}`;
  return new AppError(message, 400);
};

const handleExpressValidationError = (err: any) => {
  const errors = err.errors.map(
    (el: any) => `Path '${el.param}' ${el.msg.toLowerCase()} (${el.value}).`,
  );

  const message = `Invalid input data. ${errors.join(' ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = () => {
  new AppError('Your token has expired! Please log in again.', 401);
};

const sendErrorDev = (err: any, req: Request, res: Response) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) FOR POSSIBLE STATIC TEMPLATE PAGES
  // 1) Log error
  // eslint-disable-next-line no-console
  console.error('ERROR:', err);
  // 2) Send generic message
  return res.status(err.statusCode).json({
    title: 'Something went very wrong!',
    message: err.message,
  });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    // eslint-disable-next-line no-console
    console.error('ERROR:', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B) FOR POSSIBLE STATIC TEMPLATE PAGES
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      title: 'Something went very wrong!',
      message: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  // eslint-disable-next-line no-console
  console.error('ERROR:', err);
  // 2) Send generic message
  return res.status(err.statusCode).json({
    title: 'Something went very wrong!',
    message: 'Please try again later.',
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (err: any, req: Request, res: Response, next: NextFunction) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error: any = { ...err, name: err.name };
  error.message = err.message;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'ExpressValidatorError') error = handleExpressValidationError(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  return env === 'development' ? sendErrorDev(error, req, res) : sendErrorProd(error, req, res);
}
