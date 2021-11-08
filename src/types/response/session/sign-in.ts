import { IUser } from '../../../api/user/model';

export interface ISessionSignInResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<IUser, 'password'>;
}
