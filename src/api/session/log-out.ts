import { Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors';
import { cookieParams as cookie } from '../../config/access';
import Session from './model';
import { AuthTypedRequest } from '../../types/common/request';
import { matchedData } from 'express-validator';
import { ISessionLogOutResponse } from '../../types/response/session/log-out';

interface ICookie {
  refreshToken: string;
}

export default async (
  req: AuthTypedRequest<{ cookies: ICookie }>,
  res: Response<ISessionLogOutResponse | AppError>,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = matchedData(req, { locations: ['cookies'] }) as ICookie;

    const session = await Session.findOne({ userId: req.user.id, refreshToken });
    if (!session) {
      throw new AppError('Session not found.', 404);
    }

    await session.remove();

    const { maxAge, ...cookieParams } = cookie;

    res.cookie('refreshToken', 'deleted', { expires: new Date(0), ...cookieParams });

    res.status(204).json(null);
  } catch (error) {
    return next(error);
  }
};
