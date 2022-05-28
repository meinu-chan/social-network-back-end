import mongoose, { LeanDocument, Schema, Document } from 'mongoose';
import { IPostDocument } from '../post/model';
import { IUserDocument } from '../user/model';

export type IComment = LeanDocument<Omit<ICommentDocument, 'id' | '__v'>>;

export interface ICommentDocument extends Document {
  user: IUserDocument['_id'];
  post: IPostDocument['_id'];
  text: string;

  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<ICommentDocument>(
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
    text: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

commentSchema.index({ author: 1 });

commentSchema.pre(/^find/, function (next) {
  this.populate('user', '-password');

  next();
});

export default mongoose.model<ICommentDocument>('Comment', commentSchema);
