import { Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors';
import Chat, { IChat } from './model';
import { AuthTypedRequest } from '../../types/common/request';
import User, { IUser } from '../user/model';
import { IChatStartResponse } from '../../types/response/chat/start';

interface IBody extends Pick<IChat, 'isPrivate'> {
  withUser: IUser['_id'];
}

export default async (
  req: AuthTypedRequest<{ body: IBody }>,
  res: Response<IChatStartResponse | AppError>,
  next: NextFunction,
) => {
  try {
    const { isPrivate, withUser } = req.body;
    const { user: me } = req;

    const companion = await User.findById(withUser);

    if (!companion) throw new AppError('Chat companion not found.', 404);

    const chat = await Chat.findOrCreate({ isPrivate, members: [me.id, companion.id] });

    res.status(200).json(chat);
  } catch (error) {
    return next(error);
  }
};
