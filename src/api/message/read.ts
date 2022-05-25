import { Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors';
import { AuthTypedRequest } from '../../types/common/request';
import Message from './model';
import { IParamsId } from '../../types/common/request-params';
import { ReadMessageResponse } from '../../types/response/message/read';

export default async (
  req: AuthTypedRequest<{ params: IParamsId }>,
  res: Response<ReadMessageResponse>,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    const { id: messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) throw new AppError('Message not found.', 404);

    if (!message.author.equals(user._id)) {
      message.readBy.addToSet(user._id);

      await message.save();
    }

    return res.status(200).json(message);
  } catch (error) {
    return next(error);
  }
};
