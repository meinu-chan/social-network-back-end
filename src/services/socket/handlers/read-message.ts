import { IEventHandler, ISocket } from '../../../types/socket/common';
import { FromClientReadMessageEvent } from '../../../types/socket/from-client/chat';
import { notifyClientReadMessage } from '../events';
import { rooms } from '../rooms';

export function readMessage(
  this: ISocket,
  { chat: room, message }: FromClientReadMessageEvent['payload'],
): IEventHandler | void {
  if (rooms[room][this.id])
    return { notify: 'room', event: notifyClientReadMessage(message, room) };
}
