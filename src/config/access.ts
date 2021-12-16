import { requireEnv } from './helpers';
import { CookieOptions } from 'express';

export const jwtSecret = requireEnv('JWT_SECRET');
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '30m';

export const refreshExpiresInMS = Number(process.env.REFRESH_EXPIRES_IN_MS) || 24 * 60 * 60 * 1000;
export const refreshMaxCount = Number(process.env.REFRESH_MAX_COUNT) || 5;

export const cookieParams: CookieOptions = {
  maxAge: refreshExpiresInMS,
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};
