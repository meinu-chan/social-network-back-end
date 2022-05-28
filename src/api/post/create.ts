import { Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors';
import { AuthTypedRequest } from '../../types/common/request';
import { IParamsId } from '../../types/common/request-params';
import { CreatePostResponse } from '../../types/response/post/create';
import Post, { IPost } from './model';
import User from '../user/model';

type Body = Pick<IPost, 'text'>;

export default async (
  req: AuthTypedRequest<{ body: Body; params: IParamsId }>,
  res: Response<CreatePostResponse>,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    const { text } = req.body;

    const page = await User.findById(req.params.id);

    if (!page) throw new AppError('User not found.', 404);

    const post = await Post.create({ user: user.id, text, page: page.id });

    return res.status(201).json(post);
  } catch (error) {
    return next(error);
  }
};
