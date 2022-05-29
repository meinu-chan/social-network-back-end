import { Response, NextFunction } from 'express';
import { FilterQuery } from 'mongoose';
import { AuthTypedRequest } from '../../types/common/request';
import { IPaginationRequest, IParamsId } from '../../types/common/request-params';
import { ListCommentResponse } from '../../types/response/comment/list';
import Comment, { ICommentDocument } from './model';

interface IQuery extends Pick<IPaginationRequest, 'limit'> {
  createdAt: Date;
}

export default async (
  req: AuthTypedRequest<{ params: IParamsId; query: IQuery }>,
  res: Response<ListCommentResponse>,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { createdAt, limit } = req.query;

    const filter: FilterQuery<ICommentDocument> = { post: id };

    if (createdAt) filter.createdAt = { $lt: createdAt };

    const comments = await Comment.find(filter, {}, { limit: +limit, sort: { createdAt: -1 } });

    return res.status(200).json(comments);
  } catch (error) {
    return next(error);
  }
};
