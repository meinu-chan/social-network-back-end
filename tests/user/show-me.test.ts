import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import { RequestMethod } from '../general/constants';
import { signToken } from '../../src/services/jwt';
import tokenError from '../general/token-error';

const route = '/api/v1/users/me';
const method = RequestMethod.get;
const request = supertest(app);

const payload = {
  email: 'a1@a.com',
  fullName: 'Test A',
  password: 'teatA!1234',
  nickname: 'nickname',
  photo: 'photoUrl',
};

describe(`${route} success get user`, () => {
  test('Successfully got user', async () => {
    const user = await User.create(payload);

    const userToken = signToken(user.id);

    const { status, body } = await request[method](route).set(
      'Authorization',
      `Bearer ${userToken}`,
    );

    expect(status).toBe(200);
    expect(typeof body).toBe('object');

    type PayloadKey = keyof typeof payload;

    for (const key of Object.keys(payload) as PayloadKey[]) {
      if (key === 'password') continue;
      expect(body[key]).toBe(payload[key]);
    }
  });
});

tokenError({ request, method, route, permission: false });
