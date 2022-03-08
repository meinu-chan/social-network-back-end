import { IUser } from '../../../api/user/model';

export type INonPaginatedListUserResponse = Omit<IUser, 'password'>[];
