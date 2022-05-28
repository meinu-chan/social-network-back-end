import { Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors';
import { AuthTypedRequest } from '../../types/common/request';
import { IParamsId } from '../../types/common/request-params';
import { CommunityListResponse } from '../../types/response/user/community-list';
import User from './model';

interface IQuery {
  type: 'subscribers' | 'subscribed';
}

export default async function (
  req: AuthTypedRequest<{ params: IParamsId; query: IQuery }>,
  res: Response<CommunityListResponse>,
  next: NextFunction,
) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) throw new AppError('User not found.', 404);

    const community = await User.getCommunity(req.params.id, req.query.type);

    return res.status(200).json(community);
  } catch (error) {
    next(error);
  }
}
