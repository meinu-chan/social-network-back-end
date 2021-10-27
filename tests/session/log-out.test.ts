import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import Session from '../../src/api/session/model';
import { signToken } from '../../src/services/jwt';
import { RequestMethod } from '../general/constants';
import tokenError from '../general/token-error';

const route = '/api/v1/session/log-out';
const method = RequestMethod.post;
const request = supertest(app);

describe(`${route} Successfully logged out`, () => {
  test('Successfully logged out', async () => {
    const user = await User.create({
      email: 'a1@a.com',
      fullName: 'Test A',
      password: 'teatA!1234',
    });
    const token = signToken(user.id);
    const { refreshToken } = await Session.create({ userId: user.id });
    const { status, headers } = await request
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', [`refreshToken=${refreshToken}`]);

    expect(status).toBe(204);
    expect(Array.isArray(headers['set-cookie'])).toBe(true);
    expect(headers['set-cookie'][0]?.includes('refreshToken')).toBe(true);
  });
});

tokenError({ request, route, method, permission: false });

describe(`${route} Handle log out errors`, () => {
  test('Token verification error - invalid token id', async () => {
    const token = signToken('id');
    const { status, body } = await request.post(route).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(400);
    expect(body?.message?.includes('Invalid _id')).toBe(true);
  });

  test('Refresh token not sent', async () => {
    const user = await User.create({
      email: 'a1@a.com',
      fullName: 'Test A',
      password: 'teatA!1234',
    });
    const token = signToken(user.id);
    const { status, body } = await request.post(route).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(404);
    expect(body?.message).toMatch(/Session not found/);
  });
});
