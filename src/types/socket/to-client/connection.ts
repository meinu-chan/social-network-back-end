import { IUser } from '../../../api/user/model';
import { SocketEvent } from '../common';

type ToClientConnectionPayload = IUser['_id'];

export type ToClientConnectionEvent = SocketEvent<'online', ToClientConnectionPayload>;

type ToClientDisconnectionPayload = IUser['_id'];

export type ToClientDisconnectionEvent = SocketEvent<'disconnect', ToClientDisconnectionPayload>;

export type ToClientEvent = ToClientConnectionEvent | ToClientDisconnectionEvent;
