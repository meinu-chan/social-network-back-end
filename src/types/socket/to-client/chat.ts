import { IUser } from '../../../api/user/model';
import { SocketEvent } from '../common';

type ToClientReceiveMessagePayload = IUser['_id'];

export type ToClientReceiveMessageEvent = SocketEvent<
  'CHAT::RECEIVE',
  ToClientReceiveMessagePayload
>;

export type ToClientEvent = ToClientReceiveMessageEvent;
