import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import Post from '../../src/api/post/model';
import { RequestMethod } from '../general/constants';
import tokenError from '../general/token-error';
import invalidRequest from '../general/invalid-request';
import { signToken } from '../../src/services/jwt';
import { Types } from 'mongoose';

let token: string, postId: string;

const route = '/api/v1/comments';
const method = RequestMethod.post;
const request = supertest(app);

const payload = {
  text: 'create-comments-text',
};

describe(`${route} success create comment`, () => {
  beforeAll(async () => {
    const user = await User.create({
      email: 'create-comment@a.com',
      fullName: 'Test A',
      password: 'teatA!1234',
    });

    const post = await Post.create({ ...payload, user: user.id, page: user.id });

    postId = post.id;

    token = signToken(user.id);
  });

  test('Successfully create comment', async () => {
    const { status, body } = await request[method](`${route}/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(status).toBe(201);
    expect(typeof body).toBe('object');
    expect(body._id).toBeDefined();
    expect(body.text).toBe(payload.text);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
  });
});

tokenError({ request, method, route, permission: false, params: { id: new Types.ObjectId() } });

invalidRequest({
  request,
  method,
  route,
  body: payload,
  invalidBody: { text: 123 },
  params: { id: new Types.ObjectId() },
});
