import { Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { pagination } from '../../constants/general';
import { AuthTypedRequest } from '../../types/common/request';
import { IPaginationRequest } from '../../types/common/request-params';
import { IListUserResponse } from '../../types/response/user/list';
import User from './model';

export default async function (
  req: AuthTypedRequest<{ query: IPaginationRequest }>,
  res: Response<IListUserResponse>,
  next: NextFunction,
) {
  try {
    const query = matchedData(req, { locations: ['query'] }) as IPaginationRequest;

    const paginate = pagination(query.limit, query.page);

    const count = await User.countDocuments({});
    const users = await User.find({}, {}, paginate);
    const rows = users.map((user) => user.view());

    return res.status(200).json({ count, rows });
  } catch (error) {
    next(error);
  }
}
