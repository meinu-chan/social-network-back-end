import { IUser } from '../../../api/user/model';
import { SocketEvent } from '../common';

type FromClientConnectionPayload = IUser['_id'];

export type FromClientConnectionEvent = SocketEvent<'connect', FromClientConnectionPayload>;

type FromClientIsUserOnlinePayload = IUser['_id'];

export type FromClientIsUserOnlineEvent = SocketEvent<'isOnline', FromClientIsUserOnlinePayload>;

export type FromClientEvent = FromClientConnectionEvent | FromClientIsUserOnlineEvent;
