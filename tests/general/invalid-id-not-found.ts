import { Types } from 'mongoose';
import User, { IUserDocument, UserRole } from '../../src/api/user/model';
import { signToken } from '../../src/services/jwt/index';
import { IInvalidIdOrNotFound } from './constants';

let r: any, user: IUserDocument, userSession: any, auth: boolean;

function invalidIdNotFound({
  route,
  method,
  param = 'id',
  request,
  userRole = UserRole.admin,
  reqBody = {},
  paginated = false,
  params,
  nestedRoutes,
  query = [],
}: IInvalidIdOrNotFound) {
  const routeSetParams = (param: string) => {
    let newRoute = route + param;

    if (nestedRoutes) {
      nestedRoutes.forEach((nestedRoute) => (newRoute += `/${nestedRoute}`));
    }

    if (query.length) newRoute += `?${query.join('&')}`;

    if (paginated) newRoute += `${query ? '?' : '&'}limit=10&page=1`;

    return newRoute;
  };

  beforeAll(() => {
    r = request[method];

    auth = userRole ? true : false;

    if (params) Object.values(params).forEach((p) => (route += `/${p}`));
  });

  beforeEach(async () => {
    if (auth) {
      user = await User.create({
        fullName: 'Some User',
        email: 'invalid-id-not-found-user@mail.com',
        password: 's0mEPa5$W*rd',
        role: userRole,
      });

      userSession = signToken(user.id);
    }
  });

  describe(`${route} Handle invalid id and notFound`, () => {
    test(`Bad request - invalid ${param}`, async () => {
      const newRoute = routeSetParams('/invalid-id');

      const { status, body } = auth
        ? await r(newRoute).set('Authorization', `Bearer ${userSession}`).send(reqBody)
        : await r(newRoute).send(reqBody);

      expect(status).toBe(400);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(`Path '${param}'`);
    });

    test(`Not found - object not found into collection`, async () => {
      const newRoute = routeSetParams(`/${new Types.ObjectId()}`);

      const { status, body } = auth
        ? await r(newRoute).set('Authorization', `Bearer ${userSession}`).send(reqBody)
        : await r(newRoute).send(reqBody);

      expect(status).toBe(404);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(/not found/);
    });
  });
}

export default invalidIdNotFound;
