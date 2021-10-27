import { Document, model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { emailRegex, fullNameRegex, roles } from '../../constants/user';

export enum UserRole {
  admin = 'admin',
  user = 'user',
}

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  role: UserRole;

  view: () => IUser;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema = new Schema(
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

// Methods

userSchema.pre<IUser>('save', async function (next) {
  try {
    if (this.password) {
      const salt: string = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    //@ts-ignore
    return next(error);
  }
});

userSchema.methods = {
  view(): IUser {
    const view: any = {};
    const fields: string[] = ['_id', 'email', 'fullName', 'role'];

    fields.forEach((field: string) => (view[field] = this.get(field)));

    return view;
  },

  comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.get('password'));
  },
};

export default model<IUser>('User', userSchema);
