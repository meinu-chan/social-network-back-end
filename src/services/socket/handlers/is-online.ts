import { IEventHandler, ISocket } from '../../../types/socket/common';
import { FromClientIsUserOnlineEvent } from '../../../types/socket/from-client/connection';
import { notifyClientDisconnect, notifyClientOnline } from '../events';
import { users } from '../users';

export function isOnlineUser(
  this: ISocket,
  userId: FromClientIsUserOnlineEvent['payload'],
): IEventHandler {
  return {
    notify: 'me',
    event: users[userId] ? notifyClientOnline(userId) : notifyClientDisconnect(userId),
  };
}
