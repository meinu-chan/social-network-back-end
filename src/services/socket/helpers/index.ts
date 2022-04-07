import WebSocket from 'ws';

import { IEventHandler, ISocket, ServerToClientEvent } from '../../../types/socket/common';
import { rooms } from '../rooms';

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

const notifyOthers: NotifyFunc = function (this: WebSocket.Server<ISocket>, ws, payload) {
  this.clients.forEach((client) => {
    if (client.id !== ws.id && client.readyState === WebSocket.OPEN) {
      notify(client, payload);
    }
  });
};

const notifyRoom: NotifyFunc = function (ws, { room, ...payload }) {
  if (!room) throw Error('Please pass room id');

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
};

export default notifier;
