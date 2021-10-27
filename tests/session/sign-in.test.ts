import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import Session from '../../src/api/session/model';
import { emailRegex, fullNameRegex } from '../../src/constants/user';
import invalidRequest from '../general/invalid-request';
import { RequestMethod } from '../general/constants';

const route = '/api/v1/session/sign-in';
const method = RequestMethod.post;
const request = supertest(app);

beforeEach(async () => {
  await User.create({
    email: 'a1@a.com',
    fullName: 'Test A',
    password: 'teatA!1234',
  });
});

describe(`${route} success sign-in`, () => {
  test('Successfully login', async () => {
    const { status, body } = await request.post(route).send({
      email: 'a1@a.com',
      password: 'teatA!1234',
    });

    expect(status).toBe(200);
    expect(typeof body).toBe('object');
    expect(typeof body.accessToken).toBe('string');

    expect(typeof body.refreshToken).toBe('string');
    expect(typeof body.user.role).toBe('string');
    expect(body.user.role).toMatch(/user/);
    expect(body.user.password).toBeUndefined();
    expect(body.user.social).toBeUndefined();
    expect(typeof body.user.email).toBe('string');
    expect(body.user.email).toMatch(emailRegex);
    expect(typeof body.user.fullName).toBe('string');
    expect(body.user.fullName).toMatch(fullNameRegex);
  });
});

invalidRequest({
  request,
  method,
  route,
  body: { email: 'a@a.com', password: '12345678' },
  invalidBody: { email: 'a.com', password: '1234' },
});

describe(`${route} Session tokens`, () => {
  test('Clear previous refresh tokens in db after 5 successfully logins', async () => {
    for (let i = 0; i < 5; i++) {
      await request.post(route).send({
        email: 'a1@a.com',
        password: 'teatA!1234',
      });
    }

    const { status, body } = await request.post(route).send({
      email: 'a1@a.com',
      password: 'teatA!1234',
    });
    const refreshCount: number = await Session.countDocuments({
      userId: body.user._id,
    });

    expect(status).toBe(200);
    expect(typeof body).toBe('object');
    expect(refreshCount).toBe(1);
  });
});

describe(`${route} Handle request errors`, () => {
  test('User not found by email', async () => {
    const { status, body } = await request.post(route).send({
      email: 'a@a.com',
      password: '12345678',
    });

    expect(status).toBe(400);
    expect(typeof body).toBe('object');
  });

  test('Invalid credentials provided', async () => {
    const { status, body } = await request.post(route).send({
      email: 'a1@a.com',
      password: 'teatA!12345',
    });

    expect(status).toBe(401);
    expect(typeof body).toBe('object');
    expect(body.message).toMatch(/Invalid credentials/);
  });

  test('No credentials provided', async () => {
    const { status, body } = await request.post(route).send({});

    expect(status).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.message.includes("Path 'password' must exist")).toBe(true);
    expect(body.message.includes("Path 'email' must exist")).toBe(true);
  });
});
