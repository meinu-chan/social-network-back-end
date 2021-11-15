import { Response, NextFunction } from 'express';
import { AuthTypedRequest } from '../../types/common/request';
import { IShowMeUserResponse } from '../../types/response/user/show-me';

export default async function (
  req: AuthTypedRequest,
  res: Response<IShowMeUserResponse>,
  next: NextFunction,
) {
  try {
    return res.status(200).json(req.user.view());
  } catch (error) {
    next(error);
  }
}
