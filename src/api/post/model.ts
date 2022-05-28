import mongoose, { LeanDocument, Schema, Document } from 'mongoose';
import { IUserDocument } from '../user/model';

export type IPost = LeanDocument<Omit<IPostDocument, 'id' | '__v'>>;

export interface IPostDocument extends Document {
  user: IUserDocument['_id'];
  text: string;
  page: IUserDocument['_id'];

  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPostDocument>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    page: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

postSchema.index({ author: 1 });

postSchema.pre(/^find/, function (next) {
  this.populate('author', '-password');

  next();
});

export default mongoose.model<IPostDocument>('Post', postSchema);
