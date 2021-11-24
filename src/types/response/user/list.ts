import { IUser } from '../../../api/user/model';
import { IPaginatedResponse } from '../../common/request-params';

export type IListUserResponse = IPaginatedResponse<Omit<IUser, 'password'>>;
