import WebSocket from 'ws';

import { IEventHandler, ServerToClientEvent } from '../../../types/socket/common';

function notify(ws: WebSocket.WebSocket, payload: ServerToClientEvent) {
  ws.send(JSON.stringify(payload));
}

function notifyAll(this: WebSocket.Server, _: WebSocket.WebSocket, payload: ServerToClientEvent) {
  this.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      notify(client, payload);
    }
  });
}

function notifyOthers(
  this: WebSocket.Server,
  ws: WebSocket.WebSocket,
  payload: ServerToClientEvent,
) {
  this.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      notify(client, payload);
    }
  });
}

const notifier: {
  [key in IEventHandler['notify']]: (
    this: WebSocket.Server,
    ws: WebSocket.WebSocket,
    payload: ServerToClientEvent,
  ) => void;
} = {
  me: notify,
  all: notifyAll,
  others: notifyOthers,
};

export default notifier;
