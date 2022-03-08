import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import { RequestMethod } from '../general/constants';

const route = '/api/v1/users/non-paginated';
const method = RequestMethod.get;
const request = supertest(app);

const nickname = 'users-non-paginated-list-nickname';

const payload = {
  fullName: 'Test A',
  password: 'teatA!1234',
  photo: 'photoUrl',
};

describe(`${route} success got list of users`, () => {
  beforeAll(async () => {
    await User.insertMany([
      {
        nickname: nickname + 1,
        email: 'users-list1@a.com',
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nickname: nickname + 2,
        email: 'users-list2@a.com',
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  });

  test('Successfully got list of users', async () => {
    const { status, body } = await request[method](`${route}?field=${nickname}`);

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    for (let i = 0; i < body.length; i++) {
      for (const key in payload) {
        expect(body[i][key]);
      }

      expect(body[i].nickname).toBe(`${nickname}${i + 1}`);
      expect(body[i].email).toMatch(`users-list${i + 1}`);
    }
  });
});
