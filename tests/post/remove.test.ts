import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import Post from '../../src/api/post/model';
import { RequestMethod } from '../general/constants';
import tokenError from '../general/token-error';
import invalidIdNotFound from '../general/invalid-id-not-found';
import { signToken } from '../../src/services/jwt';
import { Types } from 'mongoose';

let token: string, postId: string;

const route = '/api/v1/posts';
const method = RequestMethod.delete;
const request = supertest(app);

const postPayload = {
  text: 'remove-post-payload',
};

describe(`${route} success remove post`, () => {
  beforeAll(async () => {
    const user = await User.create({
      email: 'create-post@a.com',
      fullName: 'Test A',
      password: 'teatA!1234',
    });

    const post = await Post.create({
      text: postPayload.text,
      user: user.id,
      page: user.id,
    });

    postId = post.id;

    token = signToken(user.id);
  });

  test('Successfully remove post', async () => {
    const { status, body } = await request[method](`${route}/${postId}`).set(
      'Authorization',
      `Bearer ${token}`,
    );

    expect(status).toBe(204);
    expect(body).toStrictEqual({});
  });
});

tokenError({ request, method, route, permission: false, params: { id: new Types.ObjectId() } });

invalidIdNotFound({ request, method, route });
