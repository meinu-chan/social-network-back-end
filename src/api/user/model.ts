import { Document, LeanDocument, model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { emailRegex, fullNameRegex, roles } from '../../constants/user';

export enum UserRole {
  admin = 'admin',
  user = 'user',
}

export type IUser = LeanDocument<Omit<IUserDocument, 'id' | '__v' | 'view' | 'comparePassword'>>;

interface IUserCountry {
  name: string;
  flag: string;
}

export interface IUserDocument extends Document {
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
  nickname?: string;
  photo?: string;
  backgroundAvatar?: string;
  birthday?: Date;
  country?: IUserCountry;
  phone?: string;
  hobbies?: string;
  job?: string;
  school?: string;
  university?: string;

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
      required: true,
    },
    nickname: {
      type: String,
      trim: true,
      minlength: 3,
    },
    photo: String,
    backgroundAvatar: String,
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
    birthday: Date,
    country: {
      _id: false,
      type: {
        name: { type: String, required: true },
        flag: { type: String, required: true },
      },
    },
    phone: String,
    job: String,
    school: String,
    university: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

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

userSchema.index({ email: 1, nickname: 1 }, { unique: true, sparse: true });

userSchema.index({ createdAt: -1 });

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
