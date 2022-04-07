import { ClientToServerEvent, IEventHandler, ISocket } from '../../../types/socket/common';
import { connectUser } from './connect-user';
import { isOnlineUser } from './is-online';
import { joinRoom } from './join-room';
import { sendMessage } from './send-message';

type SocketEventHandler = {
  [key in ClientToServerEvent['event']]: (
    this: ISocket,
    data: ClientToServerEvent['payload'],
  ) => IEventHandler | void;
};

export const handler: SocketEventHandler = {
  connect: connectUser,
  isOnline: isOnlineUser,
  joinRoom,
  sendMessage,
};
