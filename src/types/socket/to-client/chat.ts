import { IMessage } from '../../../api/message/model';
import { SocketEvent } from '../common';

type ToClientReceiveMessagePayload = IMessage;

export type ToClientReceiveMessageEvent = SocketEvent<
  'CHAT::RECEIVE',
  ToClientReceiveMessagePayload
>;

type ToClientReadMessagePayload = IMessage;

export type ToClientReadMessageEvent = SocketEvent<'MESSAGE::READ', ToClientReadMessagePayload>;

export type ToClientEvent = ToClientReceiveMessageEvent | ToClientReadMessageEvent;
