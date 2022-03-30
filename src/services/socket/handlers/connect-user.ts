import { IEventHandler } from '../../../types/socket/common';
import { FromClientConnectionEvent } from '../../../types/socket/connection';
import { notifyClientOnline } from '../events';
import { users } from '../users';

export const connectUser = (
  userId: FromClientConnectionEvent['payload'],
  socketId: string,
): IEventHandler => {
  users[socketId] = userId;
  return { event: notifyClientOnline(userId), notify: 'others' };
};
