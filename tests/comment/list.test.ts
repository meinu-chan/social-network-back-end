import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/api/user/model';
import { RequestMethod } from '../general/constants';
import { signToken } from '../../src/services/jwt';
import Post from '../../src/api/post/model';
import Comment from '../../src/api/comment/model';

let token: string, postId: string;

const route = '/api/v1/comments';
const method = RequestMethod.get;
const request = supertest(app);

const postPayload = {
  text: 'list-of-posts-text',
};

const commentPayload = {
  text: 'list-of-comment-text',
};

describe(`${route} success create post`, () => {
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

    await Comment.create({
      post: post.id,
      ...commentPayload,
      user: user.id,
    });
    await Comment.create({
      post: post.id,
      ...commentPayload,
      user: user.id,
    });

    postId = post.id;

    token = signToken(user.id);
  });

  test('Successfully get comments', async () => {
    const { status, body } = await request[method](`${route}/${postId}?limit=10`).set(
      'Authorization',
      `Bearer ${token}`,
    );

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2);
  });

  test('Successfully get comments with createdAt', async () => {
    const { status, body } = await request[method](
      `${route}/${postId}?limit=1&createdAt=${new Date()}`,
    ).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });
});
