import { ISocket } from '../../../types/socket/common';
import { FromClientJoinRoomEvent } from '../../../types/socket/from-client/chat';
import { rooms } from '../rooms';

export function joinRoom(this: ISocket, chatId: FromClientJoinRoomEvent['payload']) {
  if (!rooms[chatId]) rooms[chatId] = {};

  rooms[chatId][this.id] = this;
}
