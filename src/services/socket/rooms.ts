import { ISocket } from '../../types/socket/common';

interface IRoomUser {
  [key: ISocket['id']]: ISocket;
}

interface IRooms {
  [key: string]: IRoomUser;
}

export const rooms: IRooms = {};
