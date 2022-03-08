import { Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { FilterQuery } from 'mongoose';
import { AuthTypedRequest } from '../../types/common/request';
import { INonPaginatedListUserResponse } from '../../types/response/user/non-paginate';
import User, { IUserDocument } from './model';

interface INonPaginatedUserList {
  field?: string;
}

export default async function (
  req: AuthTypedRequest<{ query: INonPaginatedUserList }>,
  res: Response<INonPaginatedListUserResponse>,
  next: NextFunction,
) {
  try {
    const query = matchedData(req, { locations: ['query'] }) as INonPaginatedUserList;

    const filter: FilterQuery<IUserDocument> = {};

    if (query.field)
      filter.$or = [
        { fullName: { $regex: `^${query.field}`, $options: 'mi' } },
        { nickname: { $regex: `^${query.field}`, $options: 'mi' } },
      ];

    const users = (await User.find(filter)).map((user) => user.view());

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}
