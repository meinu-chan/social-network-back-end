import User, { IUserDocument, UserRole } from '../../src/api/user/model';
import { signToken } from '../../src/services/jwt/index';
import { IInvalidRequest } from './constants';

let r: any, user: IUserDocument, userSession: any, auth: boolean;

export default ({
  route,
  method,
  request,
  userRole = UserRole.admin,
  body,
  allRequired = true,
  invalidBody,
  params,
  paginated = false,
  nestedRoutes,
}: IInvalidRequest) => {
  beforeAll(() => {
    r = request[method];

    auth = userRole ? true : false;

    if (params) {
      Object.values(params).forEach((param) => (route += `/${param}`));
    }

    if (nestedRoutes) {
      nestedRoutes.forEach((nestedRoute) => (route += `/${nestedRoute}`));
    }

    if (paginated) route = route.concat('?limit=10&page=1');
  });

  beforeEach(async () => {
    if (auth) {
      user = await User.create({
        fullName: 'Some User',
        email: 'someuser@mail.com',
        password: 's0mEPa5$W*rd',
        role: userRole,
      });

      userSession = signToken(user.id);
    }
  });

  describe(`${route} Invalid params.`, () => {
    if (body)
      Object.keys(body).map((key: string) => {
        if (invalidBody && invalidBody[key]) {
          const newInvalidBody = Object.assign({}, body);

          newInvalidBody[key] = invalidBody[key];

          test(`Bad request - invalid body field ${key}`, async () => {
            const { status, body } = auth
              ? await r(route).set('Authorization', `Bearer ${userSession}`).send(newInvalidBody)
              : await r(route).send(newInvalidBody);

            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.status).toBe('fail');
            expect(body.message).toMatch(`Path '${key}`);
          });
        }

        if (allRequired) {
          const newBody = Object.assign({}, body);

          test(`Bad request - missing body field ${key}`, async () => {
            delete newBody[key];

            const { status, body } = auth
              ? await r(route).set('Authorization', `Bearer ${userSession}`).send(newBody)
              : await r(route).send(newBody);

            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.status).toBe('fail');
            expect(body.message).toMatch(`Path '${key}`);
          });
        }
      });
  });
};
