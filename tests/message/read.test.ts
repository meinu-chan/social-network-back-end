import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import Chat from '../../src/api/chat/model';
import Message from '../../src/api/message/model';
import { RequestMethod } from '../general/constants';
import invalidIdNotFound from '../general/invalid-id-not-found';
import tokenError from '../general/token-error';
import { signToken } from '../../src/services/jwt';
import { Types } from 'mongoose';

let token: string, messageId: string, userId: string;

const route = '/api/v1/messages';
const method = RequestMethod.patch;
const request = supertest(app);

describe(`${route} success read message`, () => {
  beforeEach(async () => {
    const user = await User.create({
      email: 'read-message@a.com',
      fullName: 'Test A',
      password: 'teatA!1234',
    });

    userId = user.id;

    const chat = await Chat.create({ members: [user.id] });

    const message = await Message.create({
      text: 'read-message-text',
      author: new Types.ObjectId(),
      chat: chat.id,
    });

    messageId = message.id;

    token = signToken(userId);
  });

  test('Successfully read message', async () => {
    const { status, body } = await request[method](`${route}/${messageId}`).set(
      'Authorization',
      `Bearer ${token}`,
    );

    expect(status).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.readBy).toStrictEqual([userId]);
    expect(body._id).toBeDefined();
    expect(body.author).toBeDefined();
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
  });

  test('Successfully read message by author', async () => {
    const message = await Message.create({
      text: 'read-message-text',
      author: userId,
      chat: new Types.ObjectId(),
    });

    const { status, body } = await request[method](`${route}/${message.id}`).set(
      'Authorization',
      `Bearer ${token}`,
    );

    expect(status).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.readBy).toStrictEqual([]);
    expect(body._id).toBeDefined();
    expect(body.author).toBeDefined();
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
  });
});

invalidIdNotFound({ request, method, route });

tokenError({ request, method, route, params: { id: new Types.ObjectId() }, permission: false });
