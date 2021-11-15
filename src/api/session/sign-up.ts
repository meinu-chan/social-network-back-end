import { NextFunction, Response } from 'express';
import User from '../user/model';
import { AppError } from '../../lib/errors';
import { cookieParams } from '../../config/access';
import { signToken } from '../../services/jwt';
import Session from './model';
import { matchedData } from 'express-validator';
import { TypedRequest } from '../../types/common/request';
import { ISessionSignUpResponse } from '../../types/response/session/sign-up';

interface IBody {
  email: string;
  password: string;
  nickname?: string;
  photo?: string;
}

export default async function (
  req: TypedRequest<{ body: IBody }>,
  res: Response<ISessionSignUpResponse | AppError>,
  next: NextFunction,
) {
  try {
    const body = matchedData(req, { locations: ['body'] }) as IBody;

    const isExist = await User.exists({
      $or: [
        { $and: [{ nickname: { $exists: true } }, { nickname: body.nickname }] },
        { email: body.email },
      ],
    });

    if (isExist) {
      throw new AppError('User already exists.', 400);
    }

    const user = await User.create(body);

    const accessToken = signToken(user.id);
    const { refreshToken } = await Session.create({ userId: user.id });

    res.cookie('refreshToken', refreshToken, cookieParams);

    return res.status(201).json({
      accessToken,
      refreshToken,
      user: user.view(),
    });
  } catch (error) {
    next(error);
  }
}
