import { IMessage } from '../../../api/message/model';
import { IChat } from '../../../api/chat/model';
import { SocketEvent } from '../common';

type FromClientJoinRoomPayload = IChat['_id'];

export type FromClientJoinRoomEvent = SocketEvent<'joinRoom', FromClientJoinRoomPayload>;

type FromClientSendMessagePayload = { chat: IChat['_id']; message: Omit<IMessage, '_id'> };

export type FromClientSendMessageEvent = SocketEvent<'sendMessage', FromClientSendMessagePayload>;

export type FromClientEvent = FromClientJoinRoomEvent | FromClientSendMessageEvent;
