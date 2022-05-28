import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import { RequestMethod } from '../general/constants';
import { signToken } from '../../src/services/jwt';
import Post from '../../src/api/post/model';

let token: string, userId: string;

const route = '/api/v1/posts';
const method = RequestMethod.get;
const request = supertest(app);

const postPayload = {
  text: 'list-of-posts-text',
};

describe(`${route} success create post`, () => {
  beforeAll(async () => {
    const user = await User.create({
      email: 'create-post@a.com',
      fullName: 'Test A',
      password: 'teatA!1234',
    });

    await Post.create({
      text: postPayload.text,
      user: user.id,
      page: user.id,
    });
    await Post.create({
      text: postPayload.text,
      user: user.id,
      page: user.id,
    });

    userId = user.id;

    token = signToken(userId);
  });

  test('Successfully get posts', async () => {
    const { status, body } = await request[method](`${route}/${userId}?limit=10`).set(
      'Authorization',
      `Bearer ${token}`,
    );

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2);
  });

  test('Successfully get posts with createdAt', async () => {
    const { status, body } = await request[method](
      `${route}/${userId}?limit=1&createdAt=${new Date()}`,
    ).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });
});
