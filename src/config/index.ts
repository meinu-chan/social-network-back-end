import { CookieOptions } from 'express';
import { CorsOptions } from 'cors';

export const env = process.env.NODE_ENV || 'development';

export const port = process.env.PORT || 9000;

export const cors: CorsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? (origin, callback) => {
          if (origin)
            if (process.env.CORS_URL?.split(',').includes(origin)) return callback(null, true);

          return callback(null, false);
        }
      : (origin, callback) => callback(null, true),
  optionsSuccessStatus: 200,
  credentials: Boolean(process.env.CORS_CREDENTIALS) || true,
};

export const mongo = {
  forceClose: true,
  uri: process.env.MONGO_URI || 'mongodb://localhost/development-hugo-dog',
  database: process.env.DB_NAME || 'gbn',
};
