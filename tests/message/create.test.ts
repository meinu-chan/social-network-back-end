import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import Chat from '../../src/api/chat/model';
import { RequestMethod } from '../general/constants';
import invalidIdNotFound from '../general/invalid-id-not-found';
import tokenError from '../general/token-error';
import invalidRequest from '../general/invalid-request';
import { signToken } from '../../src/services/jwt';
import { Types } from 'mongoose';

let token: string, chatId: string, userId: string;

const route = '/api/v1/messages';
const method = RequestMethod.post;
const request = supertest(app);

const payload = {
  text: 'create-message-text',
};

describe(`${route} success create message`, () => {
  beforeAll(async () => {
    const user = await User.create({
      email: 'create-message@a.com',
      fullName: 'Test A',
      password: 'teatA!1234',
    });

    userId = user.id;

    const chat = await Chat.create({ members: [user.id] });

    chatId = chat.id;

    token = signToken(userId);
  });

  test('Successfully create message', async () => {
    const { status, body } = await request[method](`${route}/${chatId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(status).toBe(201);
    expect(typeof body).toBe('object');
    expect(Array.isArray(body.readBy)).toBe(true);
    expect(body._id).toBeDefined();
    expect(body.author).toBe(userId);
    expect(body.text).toBe(payload.text);
    expect(body.chat).toBe(chatId);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
  });
});

invalidIdNotFound({ request, method, route, param: 'chat', reqBody: payload });

tokenError({ request, method, route, params: { chat: new Types.ObjectId() }, permission: false });

invalidRequest({ request, method, route, params: { chat: new Types.ObjectId() } });
