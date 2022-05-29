import { Response, NextFunction } from 'express';
import { FilterQuery } from 'mongoose';
import { AuthTypedRequest } from '../../types/common/request';
import { IPaginationRequest, IParamsId } from '../../types/common/request-params';
import { ListPostResponse } from '../../types/response/post/list';
import Post, { IPostDocument } from './model';

interface IQuery extends Pick<IPaginationRequest, 'limit'> {
  createdAt: Date;
}

export default async (
  req: AuthTypedRequest<{ params: IParamsId; query: IQuery }>,
  res: Response<ListPostResponse>,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { createdAt, limit } = req.query;

    const filter: FilterQuery<IPostDocument> = { page: id };

    if (createdAt) filter.createdAt = { $lt: createdAt };

    const posts = await Post.find(filter, {}, { limit: +limit, sort: { createdAt: -1 } });

    return res.status(200).json(posts);
  } catch (error) {
    return next(error);
  }
};
