import { IUser } from '../../../api/user/model';

export interface ISessionSignUpResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<IUser, 'password'>;
}
