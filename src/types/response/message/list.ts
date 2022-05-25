import { IMessage } from '../../../api/message/model';

export type ListMessageResponse = {
  firstUnreadMessage: IMessage | null;
  messages: IMessage[];
};
