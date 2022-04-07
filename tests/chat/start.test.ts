import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import { RequestMethod } from '../general/constants';
import { signToken } from '../../src/services/jwt';
import tokenError from '../general/token-error';
import invalidRequest from '../general/invalid-request';
import { Types } from 'mongoose';

const route = '/api/v1/chats/start';
const method = RequestMethod.post;
const request = supertest(app);

let withUser: string, userToken: string;

const userPayload = {
  fullName: 'start-chat-user',
  password: 'start-chat-user-password',
};

const payload = {
  isPrivate: true,
  withUser: new Types.ObjectId(),
};

describe(route, () => {
  beforeEach(async () => {
    const [{ _id: myId }, { _id: withId }] = await User.insertMany([
      { ...userPayload, email: 'start-chat-me@email.com' },
      { ...userPayload, email: 'start-chat-with@email.com' },
    ]);

    withUser = withId;

    userToken = signToken(myId);
  });

  describe(`${route} success start chat with user`, () => {
    test('Successfully started chat with user', async () => {
      const { status, body } = await request[method](route)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          ...payload,
          withUser,
        });

      expect(status).toBe(200);
      expect(typeof body).toBe('object');
      expect(typeof body._id).toBe('string');
      expect(body.isPrivate).toBe(payload.isPrivate);
      expect(Array.isArray(body.members)).toBe(true);
      expect(body.members.length).toBe(2);
    });
  });

  describe(`${route} handle errors start chat with user`, () => {
    test('Companion not found', async () => {
      const { status, body } = await request[method](route)
        .set('Authorization', `Bearer ${userToken}`)
        .send(payload);

      expect(status).toBe(404);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(/not found/);
    });
  });
});

invalidRequest({
  request,
  method,
  route,
  body: payload,
  invalidBody: { isPrivate: 'string', withUser: 123 },
  allRequired: false,
});

tokenError({ request, method, route, permission: false });
