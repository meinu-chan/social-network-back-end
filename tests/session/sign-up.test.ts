import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import { emailRegex, fullNameRegex } from '../../src/constants/user';
import { RequestMethod } from '../general/constants';
import invalidRequest from '../general/invalid-request';

const route = '/api/v1/session/sign-up';
const method = RequestMethod.post;
const request = supertest(app);

const payload = {
  email: 'a1@a.com',
  fullName: 'Test A',
  password: 'teatA!1234',
  birthday: new Date(),
  country: { name: 'name', flag: 'flag' },
  phone: '(123)-456-7899',
  jon: 'job',
  school: 'school',
  university: 'university',
};

describe(`${route}. Success`, () => {
  test('User successfully created', async () => {
    const { status, body } = await request.post(route).send(payload);

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
  body: payload,
  allRequired: false,
  invalidBody: { email: 'a.com', fullName: 'Test$A', password: 'teatA1234' },
});

describe(`${route}/sing-up. Handle request errors`, () => {
  test('User already exist(email duplicate)', async () => {
    await User.create(payload);

    const { status, body } = await request.post(route).send(payload);

    expect(status).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.message).toMatch(/User already exists/);
  });
  test('User already exist(nickname duplicate)', async () => {
    const payloadWithNickname = { ...payload, nickname: 'nickname' };
    await User.create(payloadWithNickname);

    const { status, body } = await request.post(route).send(payloadWithNickname);

    expect(status).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.message).toMatch(/User already exists/);
  });
});
