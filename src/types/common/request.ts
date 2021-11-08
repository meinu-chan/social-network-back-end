import { IUserDocument } from '../../api/user/model';

interface IDefaultRequest {
  body: any;
  params: any;
  query: any;
  cookies: any;
  headers: any;
}

type Typed<T = IDefaultRequest> = { [K in keyof T]: T[K] };

export declare type TypedRequest<T = IDefaultRequest> = Typed<T> &
  Omit<IDefaultRequest, keyof Typed<T>> &
  Express.Request;

interface AuthRequest {
  user: IUserDocument;
}

export declare type AuthTypedRequest<T = IDefaultRequest> = TypedRequest<T> & AuthRequest;
