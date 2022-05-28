import mongoose, { Schema } from 'mongoose';
import { IPostDocument } from '../post/model';
import { IUserDocument } from '../user/model';

export interface ILikeDocument extends Document {
  user: IUserDocument['_id'];
  post: IPostDocument['_id'];
}

const postLikeSchema = new Schema<ILikeDocument>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

postLikeSchema.index({ user: 1, post: 1 }, { unique: true });

export default mongoose.model<ILikeDocument>('PostLike', postLikeSchema);
