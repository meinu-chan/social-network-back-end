import WebSocket from 'ws';

import { FromClientEvent as FromClientConnectionEvent } from './from-client/connection';
import { FromClientEvent as FromClientChatEvent } from './from-client/chat';
import { ToClientEvent as ToClientConnectionEvent } from './to-client/connection';
import { ToClientEvent as ToClientChatEvent } from './to-client/chat';

export interface ISocket extends WebSocket.WebSocket {
  id: string;
}

export interface SocketEvent<E = string, T = any> {
  event: E;
  payload: T;
  room?: string;
}

export type ClientToServerEvent = FromClientConnectionEvent | FromClientChatEvent;

export type ServerToClientEvent = ToClientConnectionEvent | ToClientChatEvent;

export interface IEventHandler {
  event: ServerToClientEvent;
  notify: 'me' | 'others' | 'room' | 'all';
}
