import { Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors';
import { AuthTypedRequest } from '../../types/common/request';
import { ListMessageResponse } from '../../types/response/message/list';
import Chat, { IChat } from '../chat/model';
import Message from './model';

interface IParams {
  chat: IChat['_id'];
}

interface IQuery {
  date: Date;
}

export default async (
  req: AuthTypedRequest<{ params: IParams; query: IQuery }>,
  res: Response<ListMessageResponse>,
  next: NextFunction,
) => {
  try {
    const { chat: chatId } = req.params;
    const { date } = req.query;
    const { _id: userId } = req.user;

    const chat = await Chat.findById(chatId);

    if (!chat) throw new AppError('Chat not found.', 404);

    const firstUnreadMessage = await Message.findOne(
      {
        readBy: { $ne: userId },
        author: { $ne: userId },
      },
      {},
      { sort: { createdAt: 1 } },
    );

    const messages = await Message.findList(chat.id, firstUnreadMessage, date);

    return res.status(200).json({ firstUnreadMessage, messages });
  } catch (error) {
    next(error);
  }
};
