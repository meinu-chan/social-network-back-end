import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import Session from '../../src/api/session/model';

const route = '/api/v1/session/refresh-tokens';
const request = supertest(app);

let refreshToken: string;

beforeEach(async () => {
  const user = await User.create({
    email: 'a1@a.com',
    fullName: 'Test A',
    password: 'teatA!1234',
  });

  const session = await Session.create({ userId: user.id });
  refreshToken = session.refreshToken;
});

describe(`${route} Handle successful refresh`, () => {
  test('Success', async () => {
    const { status, body } = await request
      .put(route)
      .set('Cookie', [`refreshToken=${refreshToken}`]);

    expect(status).toBe(200);
    expect(typeof body.accessToken).toBe('string');
    expect(typeof body.refreshToken).toBe('string');
  });
});

describe(`${route} Handle request errors`, () => {
  test('Token not passed', async () => {
    const { status, body } = await request.put(route);

    expect(status).toBe(400);
    expect(body.message).toMatch(/cannot be empty/);
  });

  test('Invalid token', async () => {
    const { status, body } = await request.put(route).set('Cookie', ['refreshToken=asd']);

    expect(status).toBe(404);
    expect(body.message).toMatch(/Session not found/);
  });
});
