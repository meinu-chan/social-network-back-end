import { Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors';
import { cookieParams as cookie } from '../../config/access';
import Session from './model';
import { AuthRequest } from '../../types/common/auth-request';

export default async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const session = await Session.findOne({ userId: req.user.id, refreshToken });
    if (!session) {
      throw new AppError('Session not found.', 404);
    }

    await session.remove();

    const { maxAge, ...cookieParams } = cookie;

    res.cookie('refreshToken', 'deleted', { expires: new Date(0), ...cookieParams });

    res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
};
