import { Response, NextFunction } from 'express';
import { signToken } from '../../services/jwt';
import { AppError } from '../../lib/errors';
import Session from './model';
import { cookieParams } from '../../config/access';
import { TypedRequest } from '../../types/common/request';
import { ISessionRefreshTokenResponse } from '../../types/response/session/refresh-tokens';
import { matchedData } from 'express-validator';

interface ICookie {
  refreshToken: string;
}

export default async (
  req: TypedRequest<{ cookies: ICookie }>,
  res: Response<ISessionRefreshTokenResponse | AppError>,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = matchedData(req, { locations: ['cookies'] }) as ICookie;

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw new AppError('Session not found.', 404);
    }

    await session.save();

    const tokens = {
      accessToken: signToken(session.userId.toString()),
      refreshToken: session.refreshToken,
    };

    res.cookie('refreshToken', tokens.refreshToken, cookieParams);

    return res.status(200).json(tokens);
  } catch (error) {
    return next(error);
  }
};
