import { Response, NextFunction } from 'express';
import Chat from './model';
import { AuthTypedRequest } from '../../types/common/request';
import { UnreadMessagesResponse } from '../../types/response/chat/unread-messages';

export default async (
  req: AuthTypedRequest,
  res: Response<UnreadMessagesResponse>,
  next: NextFunction,
) => {
  try {
    const unreadMessage = await Chat.unreadMessagesCount(req.user._id);

    return res.status(200).json(unreadMessage);
  } catch (error) {
    return next(error);
  }
};
