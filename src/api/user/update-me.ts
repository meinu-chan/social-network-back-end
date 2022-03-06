import { Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { deleteObject } from '../../services/s3';
import { AuthTypedRequest } from '../../types/common/request';
import { IUpdateMeUserResponse } from '../../types/response/user/update-me';
import { IUser } from './model';

type IBody = Partial<Omit<IUser, 'password' | 'email' | '_id' | 'role'>>;

export default async function (
  req: AuthTypedRequest<{ body: IBody }>,
  res: Response<IUpdateMeUserResponse>,
  next: NextFunction,
) {
  try {
    const body = matchedData(req, { locations: ['body'] }) as IBody;

    let oldPhoto: string | null | undefined;
    let oldBackground: string | null | undefined;

    if (body.photo) oldPhoto = req.user.photo;
    if (body.backgroundAvatar) oldBackground = req.user.backgroundAvatar;

    await req.user.set(body).save();

    if (oldPhoto) await deleteObject(oldPhoto);
    if (oldBackground) await deleteObject(oldBackground);

    return res.status(200).json(req.user.view());
  } catch (error) {
    next(error);
  }
}
