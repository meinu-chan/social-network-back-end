import { Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { AppError } from '../../lib/errors';
import { AuthTypedRequest } from '../../types/common/request';
import { IParamsId } from '../../types/common/request-params';
import { IShowUserResponse } from '../../types/response/user/show';
import User from './model';

export default async function (
  req: AuthTypedRequest<{ params: IParamsId }>,
  res: Response<IShowUserResponse | AppError>,
  next: NextFunction,
) {
  try {
    const param = matchedData(req, { locations: ['params'] }) as IParamsId;

    const user = await User.findById(param.id);

    if (!user) throw new AppError('User not found.', 404);

    return res.status(200).json(user.view());
  } catch (error) {
    next(error);
  }
}
