import { Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors';
import { AuthTypedRequest } from '../../types/common/request';
import { IParamsId } from '../../types/common/request-params';
import { ReactOnPostResponse } from '../../types/response/like/like';
import PostLike from './model';
import Post from '../post/model';

export default async (
  req: AuthTypedRequest<{ params: IParamsId }>,
  res: Response<ReactOnPostResponse>,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) throw new AppError('Post not found.', 404);

    const like = await PostLike.findOne({ user: user.id, post: id });

    if (!like) {
      await PostLike.create({ user: user.id, post: id });
      return res.status(200).json(null);
    }

    await like.remove();

    return res.status(201).json(null);
  } catch (error) {
    return next(error);
  }
};
