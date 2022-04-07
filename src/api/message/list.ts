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
  skip: number;
}

export default async (
  req: AuthTypedRequest<{ params: IParams; query: IQuery }>,
  res: Response<ListMessageResponse>,
  next: NextFunction,
) => {
  try {
    const { chat: chatId } = req.params;
    const { skip } = req.query;

    const chat = await Chat.findById(chatId);

    if (!chat) throw new AppError('Chat not found.', 404);

    const messages = await Message.find({ chat: chat.id }, {}, { skip, limit: 20 });
    return res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
