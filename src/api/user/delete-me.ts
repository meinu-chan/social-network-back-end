import { Response, NextFunction } from 'express';
import { deleteObject } from '../../services/s3';
import { AuthTypedRequest } from '../../types/common/request';
import { IRemoveMeUserResponse } from '../../types/response/user/remove-me';

export default async function (
  req: AuthTypedRequest,
  res: Response<IRemoveMeUserResponse>,
  next: NextFunction,
) {
  try {
    await req.user.remove();

    if (req.user.photo) await deleteObject(req.user.photo);
    if (req.user.backgroundAvatar) await deleteObject(req.user.backgroundAvatar);

    return res.status(204).json(null);
  } catch (error) {
    next(error);
  }
}
