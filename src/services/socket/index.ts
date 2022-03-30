import { Server as HTTPSServer } from 'https';
import { Server as HTTPServer } from 'http';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { ClientToServerEvent } from '../../types/socket/common';
import { handler } from './handlers';
import { users } from './users';
import { notifyClientDisconnect } from './events';
import notifier from './helpers';

export const wsServer = (server: HTTPSServer | HTTPServer) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', function (ws) {
    const id = uuidv4();

    ws.on('message', async (msg) => {
      const { event, payload } = JSON.parse(msg.toString()) as ClientToServerEvent;

      const handledEvent = handler[event](payload, id);

      if (handledEvent) {
        const { notify, event } = handledEvent;

        notifier[notify].call(this, ws, event);
      }

      ws.on('close', () => {
        notifier.others.call(this, ws, notifyClientDisconnect(users[id]));
        delete users[id];
      });
    });
  });
};
