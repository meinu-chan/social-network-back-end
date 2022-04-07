import { Server as HTTPSServer } from 'https';
import { Server as HTTPServer } from 'http';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { ClientToServerEvent, ISocket } from '../../types/socket/common';
import { handler } from './handlers';
import { users } from './users';
import { notifyClientDisconnect } from './events';
import notifier from './helpers';
import { rooms } from './rooms';
import { leaveRoom } from './helpers/room';
import { logger } from './helpers/logger';

export const wsServer = (server: HTTPSServer | HTTPServer) => {
  const wss = new WebSocket.Server<ISocket>({ server });

  wss.on('connection', function (ws) {
    const id = uuidv4();
    ws.id = id;

    ws.on('message', async (msg) => {
      const { event, payload } = JSON.parse(msg.toString()) as ClientToServerEvent;

      logger(event, payload);

      const handledEvent = handler[event].call(ws, payload);

      if (handledEvent) {
        const { notify, event } = handledEvent;

        notifier[notify].call(this, ws, event);
      }
    });

    ws.on('close', () => {
      logger('close', `User ${id} closed the connection.`);

      const leave = leaveRoom.bind(ws);

      Object.keys(rooms).forEach((room) => leave(room));

      notifier.others.call(this, ws, notifyClientDisconnect(users[id]));

      delete users[id];
    });
  });
};
