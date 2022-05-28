import { Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors';
import { AuthTypedRequest } from '../../types/common/request';
import { IParamsId } from '../../types/common/request-params';
import { SubscribeUserResponse } from '../../types/response/user/subscribed';
import User from './model';

export default async function (
  req: AuthTypedRequest<{ params: IParamsId }>,
  res: Response<SubscribeUserResponse>,
  next: NextFunction,
) {
  try {
    const user = req.user;

    const subscribedUser = await User.findById(req.params.id);

    if (!subscribedUser) throw new AppError('User not found.', 404);

    await User.updateOne({ _id: subscribedUser.id }, { $addToSet: { subscribers: user.id } });
    await User.updateOne({ _id: user.id }, { $addToSet: { subscribed: subscribedUser.id } });

    return res.status(200).json(null);
  } catch (error) {
    next(error);
  }
}
