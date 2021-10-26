import { Request } from 'express';
import { IUser } from '../../api/user/model';

export interface AuthRequest extends Request {
  user: IUser;
}
