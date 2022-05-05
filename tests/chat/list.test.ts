import supertest from 'supertest';
import app from '../../src/app';
import User, { UserRole } from '../../src/api/user/model';
import Chat from '../../src/api/chat/model';
import Message from '../../src/api/message/model';
import { RequestMethod } from '../general/constants';
import tokenError from '../general/token-error';
import { signToken } from '../../src/services/jwt';

let token: string;

const route = '/api/v1/chats';
const method = RequestMethod.get;
const request = supertest(app);

const userEmail = 'get-chat-list';

const userPayload = {
  fullName: 'Test A',
  password: 'teatA!1234',
  role: UserRole.user,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const chatPayload = {
  isPrivate: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const messagePayload = {
  readBy: [],
  text: 'get-chat-list-message',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe(route, () => {
  beforeEach(async () => {
    const [{ _id: user1Id }, { _id: user2Id }, { _id: user3Id }] = await User.insertMany([
      { ...userPayload, email: `${userEmail}1@sn.com` },
      { ...userPayload, email: `${userEmail}2@sn.com` },
      { ...userPayload, email: `${userEmail}3@sn.com` },
    ]);

    const members1 = [user1Id, user2Id];
    const members2 = [user1Id, user3Id];

    const [{ _id: chat1Id }, { _id: chat2Id }] = await Chat.insertMany([
      { ...chatPayload, members: members1 },
      { ...chatPayload, members: members2 },
    ]);

    await Message.insertMany([
      { ...messagePayload, chat: chat1Id, author: user2Id },
      { ...messagePayload, chat: chat2Id, author: user3Id },
    ]);

    token = signToken(user1Id);
  });

  describe(`${route} success get list of chats`, () => {
    test('Successfully got list of chats', async () => {
      const { status, body } = await request[method](`${route}`).set(
        'Authorization',
        `Bearer ${token}`,
      );
      expect(status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(2);

      type ChatKey = keyof typeof chatPayload;
      type MessageKey = keyof typeof messagePayload;

      for (const item of body) {
        for (const key of Object.keys(chatPayload)) {
          expect(item[key]).toBe(chatPayload[key as ChatKey]);
        }

        for (const key of Object.keys(messagePayload)) {
          expect(item.lastMessage[key]).toStrictEqual(messagePayload[key as MessageKey]);
        }

        expect(item.unread).toBe(1);
      }
    });

    test('Successfully got skipped list of chats', async () => {
      const { status, body } = await request[method](`${route}?skip=1`).set(
        'Authorization',
        `Bearer ${token}`,
      );
      expect(status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(1);

      type ChatKey = keyof typeof chatPayload;
      type MessageKey = keyof typeof messagePayload;

      for (const item of body) {
        for (const key of Object.keys(chatPayload)) {
          expect(item[key]).toBe(chatPayload[key as ChatKey]);
        }

        for (const key of Object.keys(messagePayload)) {
          expect(item.lastMessage[key]).toStrictEqual(messagePayload[key as MessageKey]);
        }

        expect(item.unread).toBe(1);
      }
    });
  });

  describe(`${route} handle errors`, () => {
    test('Bad request - invalid query parameter(skip)', async () => {
      const { status, body } = await request[method](`${route}?skip=invalid`).set(
        'Authorization',
        `Bearer ${token}`,
      );

      expect(status).toBe(400);
      expect(typeof body).toBe('object');
      expect(body.status).toBe('fail');
      expect(body.message).toMatch(/Path 'skip/);
    });
  });

  tokenError({ request, method, route, permission: false });
});
