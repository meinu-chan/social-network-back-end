import { IUser } from '../../../api/user/model';
import { SocketEvent } from '../common';

type FromClientConnectionPayload = IUser['_id'];

export type FromClientConnectionEvent = SocketEvent<'USER::CONNECT', FromClientConnectionPayload>;

type FromClientIsUserOnlinePayload = IUser['_id'];

export type FromClientIsUserOnlineEvent = SocketEvent<
  'USER::IS_ONLINE',
  FromClientIsUserOnlinePayload
>;

export type FromClientEvent = FromClientConnectionEvent | FromClientIsUserOnlineEvent;
