import { ClientToServerEvent, IEventHandler, ISocket } from '../../../types/socket/common';
import { leaveRoom } from '../helpers/room';
import { connectUser } from './connect-user';
import { globalMessageReceive } from './global-message-receive';
import { isOnlineUser } from './is-online';
import { joinRoom } from './join-room';
import { readMessage } from './read-message';
import { sendMessage } from './send-message';

type SocketEventHandler = {
  [key in ClientToServerEvent['event']]: (
    this: ISocket,
    data: ClientToServerEvent['payload'],
  ) => IEventHandler | void;
};

export const handler: SocketEventHandler = {
  'USER::CONNECT': connectUser,
  'USER::IS_ONLINE': isOnlineUser,
  'CHAT::JOIN': joinRoom,
  'CHAT::SEND': sendMessage,
  'CHAT::LEAVE': leaveRoom,
  'MESSAGE::READ': readMessage,
  'GLOBAL::NOTIFY::MESSAGE_RECEIVE': globalMessageReceive,
};
