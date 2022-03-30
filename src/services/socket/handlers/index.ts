import { ClientToServerEvent, IEventHandler } from '../../../types/socket/common';
import { connectUser } from './connect-user';
import { isOnlineUser } from './is-online';

type SocketEventHandler = {
  [key in ClientToServerEvent['event']]: (
    data: ClientToServerEvent['payload'],
    socketId: string,
  ) => IEventHandler | void;
};

export const handler: SocketEventHandler = {
  connect: connectUser,
  isOnline: isOnlineUser,
};
