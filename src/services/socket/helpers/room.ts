import { IChat } from '../../../api/chat/model';
import { ISocket } from '../../../types/socket/common';
import { rooms } from '../rooms';

export function leaveRoom(this: ISocket, roomId: IChat['_id']) {
  const room = rooms[roomId];

  if (room[this.id]) delete room[this.id];
  if (!Object.keys(room).length) delete rooms[roomId];
}
