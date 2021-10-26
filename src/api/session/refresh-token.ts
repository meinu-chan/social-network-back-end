import { Request, Response, NextFunction } from 'express';
import { signToken } from '../../services/jwt';
import { AppError } from '../../lib/errors';
import Session from './model';
import { cookieParams } from '../../config/access';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw new AppError('Session not found.', 404);
    }

    await session.save();

    const tokens = {
      accessToken: signToken(session.userId),
      refreshToken: session.refreshToken,
    };

    res.cookie('refreshToken', tokens.refreshToken, cookieParams);

    return res.status(200).json(tokens);
  } catch (error) {
    return next(error);
  }
};
