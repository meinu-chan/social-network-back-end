import { IMessage } from '../../../api/message/model';
import { IChat } from '../../../api/chat/model';
import { SocketEvent } from '../common';

type FromClientJoinRoomPayload = IChat['_id'];

export type FromClientJoinRoomEvent = SocketEvent<'CHAT::JOIN', FromClientJoinRoomPayload>;

type FromClientSendMessagePayload = { chat: IChat['_id']; message: Omit<IMessage, '_id'> };

export type FromClientSendMessageEvent = SocketEvent<'CHAT::SEND', FromClientSendMessagePayload>;

export type FromClientLeaveRoomPayload = IChat['_id'];

export type FromClientLeaveRoomEvent = SocketEvent<'CHAT::LEAVE', FromClientLeaveRoomPayload>;

type FromClientReadMessagePayload = { chat: IChat['_id']; message: IMessage };

export type FromClientReadMessageEvent = SocketEvent<'MESSAGE::READ', FromClientReadMessagePayload>;

export type FromClientEvent =
  | FromClientJoinRoomEvent
  | FromClientSendMessageEvent
  | FromClientLeaveRoomEvent
  | FromClientReadMessageEvent;
