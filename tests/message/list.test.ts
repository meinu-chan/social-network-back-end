import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import Chat from '../../src/api/chat/model';
import Message, { IMessage } from '../../src/api/message/model';
import { RequestMethod } from '../general/constants';
import invalidIdNotFound from '../general/invalid-id-not-found';
import tokenError from '../general/token-error';
import { signToken } from '../../src/services/jwt';
import { Types } from 'mongoose';

interface IMessagePayload extends Omit<IMessage, 'createdAt' | 'updatedAt' | 'text'> {
  createdAt: string;
  updatedAt: string;
}

let token: string, chatId: string, userId: string, messagePayload: IMessagePayload;

const route = '/api/v1/messages';
const method = RequestMethod.get;
const request = supertest(app);

const messageText = 'get-message-text';

describe(`${route} success get message`, () => {
  beforeAll(async () => {
    const user = await User.create({
      email: 'create-message@a.com',
      fullName: 'Test A',
      password: 'teatA!1234',
    });

    userId = user.id;

    const chat = await Chat.create({ members: [user.id] });

    chatId = chat.id;

    messagePayload = {
      chat: chatId,
      readBy: [],
      author: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await Message.insertMany([
      { ...messagePayload, text: messageText + 1 },
      { ...messagePayload, text: messageText + 2 },
    ]);

    token = signToken(userId);
  });

  test('Successfully got messages', async () => {
    const { status, body } = await request[method](`${route}/${chatId}`).set(
      'Authorization',
      `Bearer ${token}`,
    );

    expect(status).toBe(200);
    expect(body.firstUnreadMessage).toBe(null);
    expect(Array.isArray(body.messages)).toBe(true);
    expect(body.messages.length).toBe(2);

    type MessageKey = keyof IMessagePayload;

    (Object.keys(messagePayload) as MessageKey[]).forEach((key) => {
      expect(body.messages[0][key]).toStrictEqual(messagePayload[key]);
    });

    expect(body.messages[0].text).toBe(messageText + 1);
  });
});

invalidIdNotFound({ request, method, route, param: 'chat', query: ['skip=1'] });

tokenError({ request, method, route, params: { chat: new Types.ObjectId() }, permission: false });
