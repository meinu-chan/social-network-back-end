import { Document, LeanDocument, Model, model, Schema, Types } from 'mongoose';
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
  lastOnline: Date;
  subscribers: IUserDocument['_id'][];
  subscribed: IUserDocument['_id'][];

  view: () => IUser;
  comparePassword: (password: string) => Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {
  getCommunity: (
    id: string,
    field: 'subscribed' | 'subscribers',
  ) => Promise<Omit<IUser, 'password'>[]>;
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
    lastOnline: {
      type: Date,
      default: new Date(),
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
    subscribers: {
      type: [Types.ObjectId],
      ref: 'User',
      default: [],
    },
    subscribed: {
      type: [Types.ObjectId],
      ref: 'User',
      default: [],
    },
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

userSchema.statics = {
  async getCommunity(
    id: string,
    field: 'subscribed' | 'subscribers',
  ): Promise<Omit<IUser, 'password'>[]> {
    const matchState = {
      $match: {
        _id: new Types.ObjectId(id),
      },
    };

    const projectStage = {
      $project: {
        [field]: 1,
        _id: 0,
      },
    };

    const unwindByFieldStage = { $unwind: { path: `$${field}` } };

    const lookupStage = {
      $lookup: {
        from: 'users',
        localField: field,
        foreignField: '_id',
        as: 'user',
      },
    };

    const unwindStage = {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    };

    const replaceRootStage = {
      $replaceRoot: {
        newRoot: '$user',
      },
    };

    const removePasswordFieldStage = {
      $project: {
        password: 0,
      },
    };

    const pipeline = [
      matchState,
      projectStage,
      unwindByFieldStage,
      lookupStage,
      unwindStage,
      replaceRootStage,
      removePasswordFieldStage,
    ];

    const community = await this.aggregate<Omit<IUser, 'password'>>(pipeline);

    return community;
  },
};

userSchema.methods = {
  view(): IUser {
    return this.toObject();
  },

  comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.get('password'));
  },
};

export default model<IUserDocument, IUserModel>('User', userSchema);
