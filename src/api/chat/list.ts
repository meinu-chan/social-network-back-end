import { Response, NextFunction } from 'express';
import { AuthTypedRequest } from '../../types/common/request';
import { ChatListResponse } from '../../types/response/chat/list';
import Chat from './model';

export default async (
  req: AuthTypedRequest,
  res: Response<ChatListResponse>,
  next: NextFunction,
) => {
  try {
    const { _id: userId } = req.user;

    const chats = await Chat.findWithLastMessage(userId);

    return res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};
