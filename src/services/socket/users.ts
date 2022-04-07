import { IUser } from '../../api/user/model';
import { ISocket } from '../../types/socket/common';

export const users: { [key: ISocket['id']]: IUser['_id'] } = {};
