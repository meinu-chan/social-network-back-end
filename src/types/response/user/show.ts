import { IUser } from '../../../api/user/model';

export type IShowUserResponse = Omit<IUser, 'password'>;
