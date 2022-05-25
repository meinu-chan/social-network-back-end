import {
  ToClientGlobalReceiveMessageEvent,
  ToClientReadMessageEvent,
  ToClientReceiveMessageEvent,
} from '../../../types/socket/to-client/chat';
import {
  ToClientConnectionEvent,
  ToClientDisconnectionEvent,
} from '../../../types/socket/to-client/connection';

export const notifyClientOnline = (
  payload: ToClientConnectionEvent['payload'],
): ToClientConnectionEvent => ({
  event: 'USER::ONLINE',
  payload,
});

export const notifyClientDisconnect = (
  payload: ToClientDisconnectionEvent['payload'],
): ToClientDisconnectionEvent => ({
  event: 'USER::DISCONNECT',
  payload,
});

export const notifyClientReceiveMessage = (
  payload: ToClientReceiveMessageEvent['payload'],
  room: string,
): ToClientReceiveMessageEvent => ({
  event: 'CHAT::RECEIVE',
  payload,
  room,
});

export const notifyClientReadMessage = (
  payload: ToClientReadMessageEvent['payload'],
  room: string,
): ToClientReadMessageEvent => ({
  event: 'MESSAGE::READ',
  payload,
  room,
});

export const notifyUserGlobalMessageReceive = (
  payload: ToClientGlobalReceiveMessageEvent['payload'],
  room: string,
): ToClientGlobalReceiveMessageEvent => ({
  event: 'GLOBAL::CHAT::RECEIVE',
  payload,
  room,
});
