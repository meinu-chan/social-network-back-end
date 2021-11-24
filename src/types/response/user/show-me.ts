import { IUser } from '../../../api/user/model';

export type IShowMeUserResponse = Omit<IUser, 'password'>;
