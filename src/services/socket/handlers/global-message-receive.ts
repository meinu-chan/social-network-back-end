import { IEventHandler, ISocket } from '../../../types/socket/common';
import { FromClientGlobalNotifyMessageReceiveEvent } from '../../../types/socket/from-client/chat';
import { notifyUserGlobalMessageReceive } from '../events';

export function globalMessageReceive(
  this: ISocket,
  userId: FromClientGlobalNotifyMessageReceiveEvent['payload'],
): IEventHandler {
  return {
    notify: 'user',
    event: notifyUserGlobalMessageReceive(null, userId),
  };
}
