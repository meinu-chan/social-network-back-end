import { Response, NextFunction } from 'express';
import { AuthTypedRequest } from '../../types/common/request';

export default async function (req: AuthTypedRequest, res: Response<null>, next: NextFunction) {
  try {
    await req.user.set({ lastOnline: new Date() }).save();

    return res.status(200).json(null);
  } catch (error) {
    next(error);
  }
}
