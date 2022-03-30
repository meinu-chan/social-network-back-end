import { IEventHandler } from '../../../types/socket/common';
import { FromClientIsUserOnlineEvent } from '../../../types/socket/connection';
import { notifyClientDisconnect, notifyClientOnline } from '../events';
import { users } from '../users';

export const isOnlineUser = (userId: FromClientIsUserOnlineEvent['payload']): IEventHandler => {
  for (const user of Object.values(users)) {
    if (userId === user) {
      return { notify: 'me', event: notifyClientOnline(userId) };
    }
  }

  return { notify: 'me', event: notifyClientDisconnect(userId) };
};
