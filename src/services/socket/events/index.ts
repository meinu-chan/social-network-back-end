import { ToClientReceiveMessageEvent } from '../../../types/socket/to-client/chat';
import {
  ToClientConnectionEvent,
  ToClientDisconnectionEvent,
} from '../../../types/socket/to-client/connection';

export const notifyClientOnline = (
  payload: ToClientConnectionEvent['payload'],
): ToClientConnectionEvent => ({
  event: 'online',
  payload,
});

export const notifyClientDisconnect = (
  payload: ToClientDisconnectionEvent['payload'],
): ToClientDisconnectionEvent => ({
  event: 'disconnect',
  payload,
});

export const notifyClientReceiveMessage = (
  payload: ToClientReceiveMessageEvent['payload'],
  room: string,
): ToClientReceiveMessageEvent => ({
  event: 'receiveMessage',
  payload,
  room,
});
