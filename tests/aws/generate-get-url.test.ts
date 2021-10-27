import supertest from 'supertest';
import app from '../../src/app';
import { RequestMethod } from '../general/constants';
import invalidRequest from '../general/invalid-request';

const route = '/api/v1/aws/generate-get-url';
const method = RequestMethod.post;
const request = supertest(app);

let userSession: any;

describe(`${route}/ Handle successful generate url`, () => {
  test(`Success public`, async () => {
    const { status, body } = await request
      .post(route)
      .set('Authorization', `Bearer ${userSession}`)
      .send({
        key: 'image.png',
      });

    expect(status).toBe(200);
    expect(typeof body).toBe('object');
    expect(typeof body.url).toBe('string');
    expect(body.url.includes('amazonaws.com')).toBe(true);
  });
});

invalidRequest({ route, method, request });
