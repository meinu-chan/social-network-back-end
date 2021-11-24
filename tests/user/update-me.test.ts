import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import { RequestMethod } from '../general/constants';
import { signToken } from '../../src/services/jwt';
import tokenError from '../general/token-error';
import invalidRequest from '../general/invalid-request';

const route = '/api/v1/users/me';
const method = RequestMethod.put;
const request = supertest(app);

const payload = {
  fullName: 'updated name',
  nickname: 'updated nickname',
  photo: 'updatedPhotoUrl',
};

describe(`${route} success delete my account`, () => {
  test('Successfully deleted my account', async () => {
    const user = await User.create({
      email: 'a1@a.com',
      fullName: 'Test A',
      password: 'teatA!1234',
      nickname: 'nickname',
      photo: 'photoUrl',
    });

    const userToken = signToken(user.id);

    const { status, body } = await request[method](route)
      .send(payload)
      .set('Authorization', `Bearer ${userToken}`);

    expect(status).toBe(200);

    type PayloadKey = keyof typeof payload;

    for (const key of Object.keys(payload) as PayloadKey[]) {
      expect(body[key]).toBe(payload[key]);
    }
    expect(body.email).toBe('a1@a.com');
  });
});

tokenError({ request, method, route, permission: false });

invalidRequest({
  request,
  method,
  route,
  allRequired: false,
  body: payload,
  invalidBody: { fullName: 1, nickname: 1, photo: 1 },
});
