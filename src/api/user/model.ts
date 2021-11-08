import { Document, LeanDocument, model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { emailRegex, fullNameRegex, roles } from '../../constants/user';

export enum UserRole {
  admin = 'admin',
  user = 'user',
}

export type IUser = LeanDocument<Omit<IUserDocument, 'id' | '__v' | 'view' | 'comparePassword'>>;

export interface IUserDocument extends Document {
  email: string;
  fullName: string;
  password: string;
  role: UserRole;

  view: () => IUser;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUserDocument> = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: emailRegex,
      index: true,
      required: true,
    },
    fullName: {
      type: String,
      trim: true,
      match: fullNameRegex,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      default: UserRole.user,
      enum: roles,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre<IUserDocument>('save', async function (next) {
  try {
    if (this.password) {
      const salt: string = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error: any) {
    return next(error);
  }
});

userSchema.index({ email: 1 }, { unique: true });

userSchema.set('toObject', {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform: (doc, ret, options) => {
    delete ret.id;
    delete ret.password;
  },
});

userSchema.methods = {
  view(): IUser {
    return this.toObject();
  },

  comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.get('password'));
  },
};

export default model<IUserDocument>('User', userSchema);
