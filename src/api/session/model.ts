import { Document, model, Schema } from 'mongoose';
import { createHash, randomBytes } from 'crypto';
import { IUser } from '../user/model';
import { refreshExpiresInMS, refreshMaxCount } from '../../config/access';

export interface ISession extends Document {
  userId: IUser['_id'];
  refreshToken: string;
}

const sessionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refreshToken: String,
  },
  { timestamps: true, versionKey: false },
);

sessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: refreshExpiresInMS / 1000 });
sessionSchema.index({ userId: 1, refreshToken: 1 }, { unique: true });

sessionSchema.pre<ISession>('save', async function (next) {
  const refreshToken = randomBytes(32).toString('hex');
  this.refreshToken = createHash('sha256').update(refreshToken).digest('hex');

  if (this.isNew) {
    const Session: any = this.constructor;
    const userId = this.userId;
    const count: number = await Session.countDocuments({ userId });

    if (count >= refreshMaxCount) {
      await Session.deleteMany({ userId });
    }
  }

  next();
});

export default model<ISession>('Session', sessionSchema);
