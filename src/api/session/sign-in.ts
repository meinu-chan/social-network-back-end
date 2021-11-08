import { Response, NextFunction } from 'express';
import User from '../user/model';
import { AppError } from '../../lib/errors';
import { signToken } from '../../services/jwt';
import Session from './model';
import { cookieParams } from '../../config/access';
import { matchedData } from 'express-validator';
import { TypedRequest } from '../../types/common/request';
import { ISessionSignInResponse } from '../../types/response/session/sign-in';

interface IBody {
  email: string;
  password: string;
}

export default async function (
  req: TypedRequest<{ body: IBody }>,
  res: Response<ISessionSignInResponse | AppError>,
  next: NextFunction,
) {
  try {
    const body = matchedData(req, { locations: ['body'] }) as IBody;

    if (!body.email || !body.password) {
      throw new AppError('Please provide email and password!', 400);
    }

    const user = await User.findOne({ email: body.email });

    if (!user) {
      throw new AppError('User not found.', 400);
    }

    const authenticated = await user.comparePassword(body.password);
    if (!authenticated) {
      throw new AppError('Invalid credentials.', 401);
    }

    const accessToken = signToken(user.id);
    const { refreshToken } = await Session.create({ userId: user.id });

    res.cookie('refreshToken', refreshToken, cookieParams);

    return res.status(200).json({
      accessToken,
      refreshToken,
      user: user.view(),
    });
  } catch (error) {
    next(error);
  }
}
