import { Document, LeanDocument, Model, model, Schema, Types } from 'mongoose';
import { IMessage } from '../message/model';
import { IUser } from '../user/model';

export type IChat = LeanDocument<Omit<IChatDocument, 'id' | '__v'>>;

export interface IChatDocument extends Document {
  isPrivate: boolean;
  members: Types.Array<IUser['_id']>;
}

interface IFindWithLastMessageObject extends Omit<IChat, 'members'> {
  members: IUser[];
  lastMessage: IMessage;
  unread: number;
}

interface IChatModel extends Model<IChatDocument> {
  findOrCreate: (body: Pick<IChat, 'isPrivate' | 'members'>) => Promise<IChatDocument>;
  findWithLastMessage: (userId: IUser['_id']) => Promise<IFindWithLastMessageObject[]>;
}

const chatSchema: Schema<IChatDocument> = new Schema(
  {
    isPrivate: {
      type: Boolean,
      default: true,
    },
    members: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

chatSchema.statics = {
  async findOrCreate(body: Pick<IChatDocument, 'isPrivate' | 'members'>): Promise<IChatDocument> {
    const matchPrivateStage = { $match: { isPrivate: true } };
    const addMembersSizeStage = { $addFields: { membersSize: { $size: '$members' } } };
    const matchMembersStage = {
      $match: {
        membersSize: body.members.length,
        members: { $all: body.members.map((userId) => new Types.ObjectId(userId)) },
      },
    };
    const projectStage = { $project: { membersSize: 0 } };

    const pipeline = [matchPrivateStage, addMembersSizeStage, matchMembersStage, projectStage];

    let [chat] = await this.aggregate(pipeline);

    if (!chat) chat = await this.create(body);

    return chat;
  },
  async findWithLastMessage(userId: IUser['_id']): Promise<IFindWithLastMessageObject[]> {
    const userObjectId = new Types.ObjectId(userId);

    const matchUserChatStage = {
      $match: {
        members: userObjectId,
      },
    };

    const limitStage = { $limit: 10 };

    const lookupMembersStage = {
      $lookup: {
        from: 'users',
        let: { userId: '$members' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$userId'],
              },
            },
          },
          {
            $project: {
              password: 0,
            },
          },
        ],
        as: 'members',
      },
    };

    const sortByCreatedAtStage = { $sort: { createdAt: -1 } };

    const facetInLookupMessageStage = {
      $facet: {
        unread: [
          {
            $match: {
              readBy: { $ne: userObjectId },
              author: { $ne: userObjectId },
            },
          },
          sortByCreatedAtStage,
        ],
        rest: [
          {
            $match: {
              $or: [{ readBy: userObjectId }, { author: userObjectId }],
            },
          },
          sortByCreatedAtStage,
        ],
      },
    };

    const lookupMessageStage = {
      $lookup: {
        from: 'messages',
        let: {
          chatId: '$_id',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$chat', '$$chatId'],
              },
            },
          },
          facetInLookupMessageStage,
        ],
        as: 'lastMessage',
      },
    };

    const addFieldsAfterLookupStage = {
      $addFields: { lastMessage: { $arrayElemAt: ['$lastMessage', 0] } },
    };

    const addFieldForLastMessageStage = {
      $addFields: {
        unread: { $size: '$lastMessage.unread' },
        lastMessage: {
          $cond: {
            if: {
              $gt: [{ $size: '$lastMessage.unread' }, 0],
            },
            then: { $arrayElemAt: ['$lastMessage.unread', 0] },
            else: { $arrayElemAt: ['$lastMessage.rest', 0] },
          },
        },
      },
    };

    const sortStage = {
      $sort: { 'lastMessage.createdAt': -1, unread: -1 },
    };

    const pipeline = [
      matchUserChatStage,
      limitStage,
      lookupMembersStage,
      lookupMessageStage,
      addFieldsAfterLookupStage,
      addFieldForLastMessageStage,
      sortStage,
    ];

    const chats = await this.aggregate<IFindWithLastMessageObject>(pipeline);

    return chats;
  },
};

export default model<IChatDocument, IChatModel>('Chat', chatSchema);
