import { IChat } from '../../../api/chat/model';
import { IMessage } from '../../../api/message/model';
import { IUser } from '../../../api/user/model';

interface IChatListItem extends Omit<IChat, 'members'> {
  members: IUser[];
  lastMessage: IMessage;
  unread: number;
}

export type ChatListResponse = IChatListItem[];
