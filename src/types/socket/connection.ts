import { IUser } from '../../api/user/model';
import { SocketEvent } from './common';

type FromClientConnectionPayload = IUser['_id'];

export type FromClientConnectionEvent = SocketEvent<'connect', FromClientConnectionPayload>;

type ToClientConnectionPayload = IUser['_id'];

export type ToClientConnectionEvent = SocketEvent<'online', ToClientConnectionPayload>;

type ToClientDisconnectionPayload = IUser['_id'];

export type ToClientDisconnectionEvent = SocketEvent<'disconnect', ToClientDisconnectionPayload>;

type FromClientIsUserOnlinePayload = IUser['_id'];

export type FromClientIsUserOnlineEvent = SocketEvent<'isOnline', FromClientIsUserOnlinePayload>;

export type FromClientEvent = FromClientConnectionEvent | FromClientIsUserOnlineEvent;

export type ToClientEvent = ToClientConnectionEvent | ToClientDisconnectionEvent;
