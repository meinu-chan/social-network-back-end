import {
  ToClientConnectionEvent,
  ToClientDisconnectionEvent,
} from '../../../types/socket/connection';

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
