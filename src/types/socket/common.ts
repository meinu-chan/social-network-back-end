import {
  FromClientEvent as FromClientConnectionEvent,
  ToClientEvent as ToClientConnectionEvent,
} from './connection';

export interface SocketEvent<E = string, T = any> {
  event: E;
  payload: T;
}

export type ClientToServerEvent = FromClientConnectionEvent;

export type ServerToClientEvent = ToClientConnectionEvent;

export interface IEventHandler {
  event: ServerToClientEvent;
  notify: 'me' | 'others' | 'all';
}
