import { IUser } from '../../../api/user/model';

export type CommunityListResponse = Omit<IUser, 'password'>[];
