import { Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors';
import { AuthTypedRequest } from '../../types/common/request';
import { IParamsId } from '../../types/common/request-params';
import PostLike from './model';
import Post from '../post/model';
import { ILikeListResponse } from '../../types/response/like/list';

export default async (
  req: AuthTypedRequest<{ params: IParamsId }>,
  res: Response<ILikeListResponse>,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) throw new AppError('Post not found.', 404);

    const isMeLiked = await PostLike.exists({ user: user.id, post: id });

    const likesCount = await PostLike.countDocuments({ post: id });

    return res.status(200).json({ isMeLiked, likesCount });
  } catch (error) {
    return next(error);
  }
};
