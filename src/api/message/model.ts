import { Document, model, LeanDocument, Schema, Model, Types } from 'mongoose';
import { IUser } from '../user/model';
import { IChat } from '../chat/model';

export type IMessage = LeanDocument<Omit<IMessageDocument, 'id' | '__v'>>;

export interface IMessageDocument extends Document {
  text: string;
  chat: IChat['_id'];
  author: IUser['_id'];
  readBy: Types.Array<IUser['_id']>;

  createdAt: Date;
  updatedAt: Date;
}

interface IMessageModel extends Model<IMessageDocument> {
  findList: (
    chat: IChat['_id'],
    firstUnreadMessage: IMessage | null,
    date?: Date,
  ) => Promise<IMessage[]>;
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

messageSchema.statics = {
  async findList(chat: IChat['_id'], firstUnreadMessage: IMessage | null, date: Date = new Date()) {
    const matchStage = {
      $match: {
        chat: new Types.ObjectId(chat),
        createdAt: { $lt: date },
      },
    };

    let fromFirstUnreadMessagePipeline: any[] = [];

    if (firstUnreadMessage) {
      const { createdAt } = firstUnreadMessage;

      const facetStage = {
        $facet: {
          olderMessages: [
            {
              $match: {
                createdAt: {
                  $lt: new Date(createdAt),
                },
              },
            },
            { $sort: { createdAt: -1 } },
            {
              $limit: 5,
            },
          ],
          newerMessages: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(createdAt),
                },
              },
            },
          ],
        },
      };

      const projectStage = {
        $project: {
          messages: {
            $concatArrays: ['$olderMessages', '$newerMessages'],
          },
        },
      };

      const unwindStage = {
        $unwind: {
          path: '$messages',
        },
      };

      const replaceRootStage = {
        $replaceRoot: {
          newRoot: '$messages',
        },
      };

      fromFirstUnreadMessagePipeline = [facetStage, projectStage, unwindStage, replaceRootStage];
    }

    const sortMessagesStage = { $sort: { createdAt: -1 } };

    const limitStage = { $limit: 20 };

    const pipeline = [matchStage, ...fromFirstUnreadMessagePipeline, sortMessagesStage];

    if (!firstUnreadMessage) pipeline.push(limitStage);

    const messages = await this.aggregate<IMessage>(pipeline);

    return messages;
  },
};

export default model<IMessageDocument, IMessageModel>('Message', messageSchema);
