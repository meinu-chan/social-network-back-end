import { Document, LeanDocument, Model, model, Schema, Types } from 'mongoose';
import { IUser } from '../user/model';

export type IChat = LeanDocument<Omit<IChatDocument, 'id' | '__v'>>;

export interface IChatDocument extends Document {
  isPrivate: boolean;
  members: IUser['_id'][];
}
interface IChatModel extends Model<IChatDocument> {
  findOrCreate: (body: Pick<IChat, 'isPrivate' | 'members'>) => Promise<IChatDocument>;
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
  async findOrCreate(body: Pick<IChatDocument, 'isPrivate' | 'members'>) {
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
};

export default model<IChatDocument, IChatModel>('Chat', chatSchema);
