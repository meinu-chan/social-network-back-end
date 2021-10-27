import { Types } from 'mongoose';
import User, { IUser, UserRole } from '../../src/api/user/model';
import { signToken } from '../../src/services/jwt/index';
import { IInvalidIdOrNotFound } from './constants';

let r: any, user: IUser, userSession: any, auth: boolean;

export default ({
  route,
  method,
  param = 'id',
  request,
  userRole = UserRole.admin,
  reqBody = {},
  paginated = false,
  params,
  nestedRoutes,
}: IInvalidIdOrNotFound) => {
  beforeAll(() => {
    r = request[method];

    auth = userRole ? true : false;

    if (params) Object.values(params).forEach((p) => (route += `/${p}`));
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

  describe(`${route} Handle invalid id and notFound`, () => {
    test(`Bad request - invalid ${param}`, async () => {
      let newRoute = route.concat('/invalid-id');

      if (nestedRoutes) {
        nestedRoutes.forEach((nestedRoute) => (newRoute += `/${nestedRoute}`));
      }

      if (paginated) newRoute = newRoute.concat('?limit=10&page=1');

      const { status, body } = auth
        ? await r(newRoute).set('Authorization', `Bearer ${userSession}`).send(reqBody)
        : await r(newRoute).send(reqBody);

      expect(status).toBe(400);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(`Path '${param}'`);
    });

    test(`Not found - object not found into collection`, async () => {
      let newRoute = route.concat(`/${Types.ObjectId()}`);

      if (nestedRoutes) {
        nestedRoutes.forEach((nestedRoute) => (newRoute += `/${nestedRoute}`));
      }

      if (paginated) newRoute = newRoute.concat('?limit=10&page=1');

      const { status, body } = auth
        ? await r(newRoute).set('Authorization', `Bearer ${userSession}`).send(reqBody)
        : await r(newRoute).send(reqBody);

      expect(status).toBe(404);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(/not found/);
    });
  });
};
