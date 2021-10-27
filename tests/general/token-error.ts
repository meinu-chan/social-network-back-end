import User from '../../src/api/user/model';
import { signToken } from '../../src/services/jwt/index';
import { ITokenErrors } from './constants';

let r: any;

export default ({
  route,
  method,
  params,
  request,
  permission = true,
  paginated = false,
  nestedRoutes,
}: ITokenErrors) => {
  beforeAll(() => {
    r = request[method];

    if (params) {
      Object.values(params).forEach((param) => (route += `/${param}`));
    }

    if (nestedRoutes) {
      nestedRoutes.forEach((nestedRoute) => (route += `/${nestedRoute}`));
    }

    if (paginated) route = route.concat('?limit=10&page=1');
  });

  describe(`${route} Handle token errors`, () => {
    test(`You are not logged in.`, async () => {
      const { status, body } = await r(route);

      expect(status).toBe(401);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(/You are not logged in! Please log in to get access./);
    });

    test(`Token verification error.`, async () => {
      const { status, body } = await r(route).set('Authorization', `Bearer 123`);

      expect(status).toBe(401);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(/Token verification error./);
    });

    if (permission)
      test(`Permission denied`, async () => {
        const user = await User.create({
          email: 'i@user.com',
          fullName: 'Mr User',
          password: 'Us3r%Pa55w0rD',
        });

        const userSession = signToken(user.id);

        const { status, body } = await r(route).set('Authorization', `Bearer ${userSession}`);

        expect(status).toBe(403);
        expect(typeof body).toBe('object');
        expect(body.status).toBe('fail');
        expect(body.message).toMatch(/You don't have permission/);
      });
  });
};
