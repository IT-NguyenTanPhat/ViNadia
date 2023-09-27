import app from '../src/app';
import request from 'supertest';
import { PostModel } from '../src/post';
import { Types } from 'mongoose';
import { UserModel } from '../src/user';
import jwt from 'jsonwebtoken';

let mockData: any;
let token: string;

beforeEach(async () => {
  const user = await UserModel.create({
    name: 'fake',
    email: 'fake@email.com',
    password: 'fake',
  });

  mockData = { user, post: await PostModel.create({ author: user._id }) };

  token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'vinadia', {
    expiresIn: '30m',
  });
});

afterEach(async () => {
  await UserModel.findByIdAndDelete(mockData.user._id);
  await PostModel.findByIdAndDelete(mockData.post._id);
});

// getFeedPosts
describe('GET /posts', () => {
  test('should return status 200 and post list', async () => {
    const { statusCode, body } = await request(app).get(`/posts`);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('posts');
    expect(Array.isArray(body.posts)).toBe(true);
  });
});

// createPost
describe('POST /posts', () => {
  test('should return status 201 if create successfully', async () => {
    const { statusCode, body } = await request(app)
      .post(`/posts`)
      .send({ author: mockData.user._id })
      .set('Authorization', token);

    expect(statusCode).toBe(201);
    expect(body).toHaveProperty('post');
    expect(typeof body.post === 'object').toBe(true);

    await PostModel.findByIdAndDelete(body.post._id);
  });
});

// likeOrDislikePost
describe('PATCH /posts/:id', () => {
  test('should return status 404 if post not found', async () => {
    const { statusCode, body } = await request(app)
      .patch(`/posts/${new Types.ObjectId()}/like`)
      .send({ userId: mockData.user._id })
      .set('Authorization', token);

    expect(statusCode).toBe(404);
    expect(body).toEqual({ message: 'Post not found' });
  });

  test('should return status 200 if update successfully', async () => {
    const { statusCode, body } = await request(app)
      .patch(`/posts/${mockData.post._id}/like`)
      .send({ userId: mockData.user._id })
      .set('Authorization', token);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('post');
    expect(typeof body.post === 'object').toBe(true);
  });
});
