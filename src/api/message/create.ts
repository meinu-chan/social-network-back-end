import { Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors';
import { AuthTypedRequest } from '../../types/common/request';
import { CreateMessageResponse } from '../../types/response/message/create';
import Message, { IMessage } from './model';
import Chat from '../chat/model';

type Body = Pick<IMessage, 'text'>;
type Params = Pick<IMessage, 'chat'>;

export default async (
  req: AuthTypedRequest<{ body: Body; params: Params }>,
  res: Response<CreateMessageResponse>,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    const { text } = req.body;
    const { chat: chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) throw new AppError('Chat not found', 404);

    const message = await Message.create({ author: user.id, text, chat: chat.id });

    return res.status(201).json(message);
  } catch (error) {
    return next(error);
  }
};
