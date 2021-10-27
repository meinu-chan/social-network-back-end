import supertest from 'supertest';
import { UserRole } from '../../src/api/user/model';

export enum RequestMethod {
  post = 'post',
  get = 'get',
  patch = 'patch',
  delete = 'delete',
  put = 'put',
}

export interface IBasicRequestError {
  //route for test request
  route: string;

  //request type
  method: RequestMethod;

  //app
  request: supertest.SuperTest<supertest.Test>;

  //params for requests
  params?: { [key: string]: any };

  //set user role needed to make request
  userRole?: UserRole | null;

  //set nested routes after params
  nestedRoutes?: string[];

  //is request is paginated
  paginated?: boolean;
}

export interface ITokenErrors extends IBasicRequestError {
  //test permission for request
  permission?: boolean;
}

export interface IInvalidRequest extends IBasicRequestError {
  method: RequestMethod.post | RequestMethod.put | RequestMethod.patch;

  //is all fields in body are required
  allRequired?: boolean;

  //body params for request
  body?: { [key: string]: any };

  //invalid body params for request
  invalidBody?: { [key: string]: any };
}

export interface IInvalidIdOrNotFound extends IBasicRequestError {
  param?: string;
  reqBody?: { [key: string]: any };
}
