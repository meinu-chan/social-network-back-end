import { Response, NextFunction } from 'express';
import { AuthTypedRequest } from '../../types/common/request';
import { ChatListResponse } from '../../types/response/chat/list';
import Chat from './model';

interface IQuery {
  skip: number;
}

export default async (
  req: AuthTypedRequest<{ query: IQuery }>,
  res: Response<ChatListResponse>,
  next: NextFunction,
) => {
  try {
    const { skip } = req.query;
    const { _id: userId } = req.user;

    const chats = await Chat.findWithLastMessage(userId, skip || 0);

    return res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};
