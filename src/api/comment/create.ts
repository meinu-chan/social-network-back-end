import { NextFunction, Response } from 'express';
import { AppError } from '../../lib/errors';
import { AuthTypedRequest } from '../../types/common/request';
import { IParamsId } from '../../types/common/request-params';
import Comment, { IComment } from './model';
import Post from '../post/model';
import { CreateCommentResponse } from '../../types/response/comment/create';

type Body = Pick<IComment, 'text'>;

export default async (
  req: AuthTypedRequest<{ body: Body; params: IParamsId }>,
  res: Response<CreateCommentResponse>,
  next: NextFunction,
) => {
  try {
    const { text } = req.body;
    const user = req.user;

    const post = await Post.findById(req.params.id);

    if (!post) throw new AppError('Post not found.', 404);

    const comment = await Comment.create({
      text,
      user: user.id,
      post: post.id,
    });

    return res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};
