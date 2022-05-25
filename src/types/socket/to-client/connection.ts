import { IUser } from '../../../api/user/model';
import { SocketEvent } from '../common';

type ToClientConnectionPayload = IUser['_id'];

export type ToClientConnectionEvent = SocketEvent<'USER::ONLINE', ToClientConnectionPayload>;

type ToClientDisconnectionPayload = IUser['_id'];

export type ToClientDisconnectionEvent = SocketEvent<
  'USER::DISCONNECT',
  ToClientDisconnectionPayload
>;

export type ToClientEvent = ToClientConnectionEvent | ToClientDisconnectionEvent;
