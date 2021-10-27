import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import { emailRegex, fullNameRegex } from '../../src/constants/user';
import { RequestMethod } from '../general/constants';
import invalidRequest from '../general/invalid-request';

const route = '/api/v1/session/sign-up';
const method = RequestMethod.post;
const request = supertest(app);

describe(`${route}. Success`, () => {
  test('User successfully created', async () => {
    const { status, body } = await request.post(route).send({
      email: 'a1@a.com',
      fullName: 'Test A',
      password: 'teatA!1234',
    });

    expect(status).toBe(201);
    expect(typeof body).toBe('object');
    expect(typeof body.user.role).toBe('string');
    expect(typeof body.accessToken).toBe('string');
    expect(typeof body.refreshToken).toBe('string');
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
  body: { email: 'a@a.com', fullName: 'Test A', password: 'teatA!1234' },
  invalidBody: { email: 'a.com', fullName: 'Test$A', password: 'teatA1234' },
});

describe(`${route}/sing-up. Handle request errors`, () => {
  test('User already exist', async () => {
    await User.create({
      email: 'a@a.com',
      fullName: 'Test A',
      password: 'teatA!1234',
    });

    const { status, body } = await request.post(route).send({
      email: 'a@a.com',
      fullName: 'Test A',
      password: 'teatA!1234',
    });

    expect(status).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.message).toMatch(/User already exists/);
  });
});
