import WebSocket from 'ws';

import { IEventHandler, ISocket, ServerToClientEvent } from '../../../types/socket/common';
import { rooms } from '../rooms';
import { users } from '../users';

type NotifyArgs = [ws: ISocket, payload: ServerToClientEvent];
type NotifyFunc = (...args: NotifyArgs) => void;

const notify: NotifyFunc = function (ws, payload) {
  ws.send(JSON.stringify(payload));
};

const notifyAll: NotifyFunc = function (this: WebSocket.Server<ISocket>, _, payload) {
  this.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      notify(client, payload);
    }
  });
};

const notifyUser: NotifyFunc = function (
  this: WebSocket.Server<ISocket>,
  _,
  { room: userId, ...payload },
) {
  if (!userId) throw new Error('User id not passed.');

  if (users[userId]) {
    notify(users[userId], payload);
  }
};

const notifyOthers: NotifyFunc = function (this: WebSocket.Server<ISocket>, ws, payload) {
  this.clients.forEach((client) => {
    if (client.id !== ws.id && client.readyState === WebSocket.OPEN) {
      notify(client, payload);
    }
  });
};

const notifyRoom: NotifyFunc = function (ws, { room, ...payload }) {
  if (!room) throw Error('Room id not passed.');

  Object.values(rooms[room]).forEach((client) => {
    if (client.id !== ws.id && client.readyState === WebSocket.OPEN) {
      notify(client, payload);
    }
  });
};

const notifier: {
  [key in IEventHandler['notify']]: NotifyFunc;
} = {
  me: notify,
  all: notifyAll,
  others: notifyOthers,
  room: notifyRoom,
  user: notifyUser,
};

export default notifier;
