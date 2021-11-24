import { IUser } from '../../../api/user/model';

export type IUpdateMeUserResponse = Omit<IUser, 'password'>;
