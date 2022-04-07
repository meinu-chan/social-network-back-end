import { IEventHandler, ISocket } from '../../../types/socket/common';
import { FromClientConnectionEvent } from '../../../types/socket/from-client/connection';
import { notifyClientOnline } from '../events';
import { users } from '../users';

export function connectUser(
  this: ISocket,
  userId: FromClientConnectionEvent['payload'],
): IEventHandler {
  users[this.id] = userId;

  return { event: notifyClientOnline(userId), notify: 'others' };
}
