import { Response, NextFunction } from 'express';
import { AuthTypedRequest } from '../../types/common/request';
import { IRemoveMeUserResponse } from '../../types/response/user/remove-me';

export default async function (
  req: AuthTypedRequest,
  res: Response<IRemoveMeUserResponse>,
  next: NextFunction,
) {
  try {
    await req.user.remove();

    return res.status(204).json(null);
  } catch (error) {
    next(error);
  }
}
