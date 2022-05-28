import { Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors';
import { AuthTypedRequest } from '../../types/common/request';
import { IParamsId } from '../../types/common/request-params';
import { IRemovePostResponse } from '../../types/response/post/remove';
import Post from './model';

export default async (
  req: AuthTypedRequest<{ params: IParamsId }>,
  res: Response<IRemovePostResponse>,
  next: NextFunction,
) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) throw new AppError('Post not found.', 404);

    return res.status(204).json(null);
  } catch (error) {
    return next(error);
  }
};
