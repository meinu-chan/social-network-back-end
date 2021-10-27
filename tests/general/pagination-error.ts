import User, { IUser, IUserRoles } from '../../src/api/user/model';
import { signToken } from '../../src/services/jwt/index';
import { IBasicRequestError } from './constants';

let r: any, user: IUser, userSession: any, auth: boolean;

export default ({
  route,
  method,
  request,
  params,
  userRole = IUserRoles.admin,
  nestedRoutes,
}: IBasicRequestError) =>
  describe(`${route} Invalid pagination params.`, () => {
    beforeAll(() => {
      r = request[method];

      auth = userRole ? true : false;

      if (params) {
        Object.values(params).forEach((param) => (route += `/${param}`));
      }

      if (nestedRoutes) {
        nestedRoutes.forEach((nestedRoute) => (route += `/${nestedRoute}`));
      }
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

    test(`Query params - missing limit`, async () => {
      const newRoute = route + '/?page=1';
      const { status, body } = auth
        ? await r(newRoute).set('Authorization', `Bearer ${userSession}`).send()
        : await r(newRoute).send();

      expect(status).toBe(400);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(
        "Invalid input data. Path 'limit' - per page limit is not passed (undefined).",
      );
    });

    test(`Query params - missing page`, async () => {
      const newRoute = route + '/?limit=1';

      const { status, body } = auth
        ? await r(newRoute).set('Authorization', `Bearer ${userSession}`).send()
        : await r(newRoute).send();

      expect(status).toBe(400);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(
        "Invalid input data. Path 'page' - page is not selected (undefined).",
      );
    });

    test(`Query params - invalid page, not an integer`, async () => {
      const newRoute = route + '/?page=hi&limit=1';

      const { status, body } = auth
        ? await r(newRoute).set('Authorization', `Bearer ${userSession}`).send()
        : await r(newRoute).send();

      expect(status).toBe(400);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(
        "Invalid input data. Path 'page' - page should be greater then 0 (hi).",
      );
    });

    test(`Query params - invalid limit, not an integer`, async () => {
      const newRoute = route + '/?limit=hi&page=1';

      const { status, body } = auth
        ? await r(newRoute).set('Authorization', `Bearer ${userSession}`).send()
        : await r(newRoute).send();

      expect(status).toBe(400);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(
        "Invalid input data. Path 'limit' - per page limit should be greater then 0 (hi).",
      );
    });

    test(`Query params - invalid page, less then 1`, async () => {
      const newRoute = route + '/?page=0&limit=1';

      const { status, body } = auth
        ? await r(newRoute).set('Authorization', `Bearer ${userSession}`).send()
        : await r(newRoute).send();

      expect(status).toBe(400);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(
        "Invalid input data. Path 'page' - page should be greater then 0 (0).",
      );
    });

    test(`Query params - invalid limit, less then 1`, async () => {
      const newRoute = route + '/?limit=0&page=1';

      const { status, body } = auth
        ? await r(newRoute).set('Authorization', `Bearer ${userSession}`).send()
        : await r(newRoute).send();

      expect(status).toBe(400);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(
        "Invalid input data. Path 'limit' - per page limit should be greater then 0 (0).",
      );
    });
  });
