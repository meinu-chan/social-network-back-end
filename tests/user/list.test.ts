import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import { RequestMethod } from '../general/constants';
import paginationError from '../general/pagination-error';

const route = '/api/v1/users/';
const method = RequestMethod.get;
const request = supertest(app);

const nickname = 'users-list-nickname';

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
    const { status, body } = await request[method](`${route}?limit=10&page=1`);

    expect(status).toBe(200);
    expect(body.count).toBe(2);
    expect(Array.isArray(body.rows)).toBe(true);
    for (let i = 0; i < body.rows.length; i++) {
      for (const key in payload) {
        expect(body.rows[i][key]);
      }

      expect(body.rows[i].nickname).toBe(`${nickname}${i + 1}`);
      expect(body.rows[i].email).toMatch(`users-list${i + 1}`);
    }
  });
});

paginationError({ request, method, route, userRole: null });
