import { IEventHandler, ISocket } from '../../../types/socket/common';
import { FromClientSendMessageEvent } from '../../../types/socket/from-client/chat';
import { notifyClientReceiveMessage } from '../events';
import { rooms } from '../rooms';

export function sendMessage(
  this: ISocket,
  { chat: room, message }: FromClientSendMessageEvent['payload'],
): IEventHandler | void {
  if (rooms[room][this.id])
    return { notify: 'room', event: notifyClientReceiveMessage(message, room) };

  throw new Error('Some error');
}
