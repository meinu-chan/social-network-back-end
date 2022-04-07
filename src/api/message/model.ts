import { Document, model, LeanDocument, Schema } from 'mongoose';
import { IUser } from '../user/model';
import { IChat } from '../chat/model';

export type IMessage = LeanDocument<Omit<IMessageDocument, 'id' | '__v'>>;

export interface IMessageDocument extends Document {
  text: string;
  chat: IChat['_id'];
  author: IUser['_id'];
  readBy: IUser['_id'][];

  createdAt: Date;
  updatedAt: Date
}

const messageSchema: Schema<IMessageDocument> = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    readBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default model<IMessageDocument>('Message', messageSchema);
