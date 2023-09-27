import app from '../src/app';
import request from 'supertest';
import { Types } from 'mongoose';
import { UserModel } from '../src/user';
import jwt from 'jsonwebtoken';

let user: any;
let token: string;

beforeEach(async () => {
  user = await UserModel.create({
    name: 'fake',
    email: 'fake@email.com',
    password: 'fake',
  });

  token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'vinadia', {
    expiresIn: '30m',
  });
});

afterEach(async () => {
  await UserModel.findByIdAndDelete(user._id);
});

// getUserProfile
describe('GET /users/:id', () => {
  test('should return status 200 and user', async () => {
    const { statusCode, body } = await request(app)
      .get(`/users/${user._id}`)
      .set('Authorization', token);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('user');
    expect(typeof body.user === 'object').toBe(true);
  });
});

// getUserPosts
describe('GET /users/:id/posts', () => {
  test('should return status 200 and post list', async () => {
    const { statusCode, body } = await request(app)
      .get(`/users/${user._id}/posts`)
      .set('Authorization', token);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('posts');
    expect(Array.isArray(body.posts)).toBe(true);
  });

  test('should return status 404 if user not found', async () => {
    const { statusCode, body } = await request(app)
      .get(`/users/${new Types.ObjectId()}/posts`)
      .set('Authorization', token);

    expect(statusCode).toBe(404);
    expect(body).toEqual({ message: 'User not found' });
  });
});

// getSuggestedFriends
describe('GET /users/:id/suggested-friends', () => {
  test('should return status 200 and friend list', async () => {
    const { statusCode, body } = await request(app)
      .get(`/users/${user._id}/suggested-friends`)
      .set('Authorization', token);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('friends');
    expect(Array.isArray(body.friends)).toBe(true);
  });

  test('should return status 404 if user not found', async () => {
    const { statusCode, body } = await request(app)
      .get(`/users/${new Types.ObjectId()}/suggested-friends`)
      .set('Authorization', token);

    expect(statusCode).toBe(404);
    expect(body).toEqual({ message: 'User not found' });
  });
});
