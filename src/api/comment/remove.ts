import { NextFunction, Response } from 'express';
import { AppError } from '../../lib/errors';
import { AuthTypedRequest } from '../../types/common/request';
import { IParamsId } from '../../types/common/request-params';
import Comment from './model';
import { RemoveCommentResponse } from '../../types/response/comment/remove';

export default async (
  req: AuthTypedRequest<{ params: IParamsId }>,
  res: Response<RemoveCommentResponse>,
  next: NextFunction,
) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) throw new AppError('Comment not found.', 404);

    return res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};
