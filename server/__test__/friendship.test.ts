import app from '../src/app';
import request from 'supertest';
import { FriendshipModel } from '../src/friendship';
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

  mockData = {
    user,
    relation: await FriendshipModel.create({
      from: user._id,
      to: new Types.ObjectId(),
    }),
  };

  token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'vinadia', {
    expiresIn: '30m',
  });
});

afterEach(async () => {
  await UserModel.findByIdAndDelete(mockData.user._id);
  await FriendshipModel.findByIdAndDelete(mockData.relation._id);
});

// getUserFriends
describe('GET /friendships/:userId', () => {
  test('should return status 200 and friend list', async () => {
    const { statusCode, body } = await request(app)
      .get(`/friendships/${mockData.user._id}`)
      .set('Authorization', token);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('friends');
    expect(Array.isArray(body.friends)).toBe(true);
  });
});

// getFriendStatus
describe('GET /friendships/:userId/:friendId', () => {
  test('should return status 200 and friend status', async () => {
    const path = `/friendships/${mockData.relation.from}/${mockData.relation.to}`;
    const { statusCode, body } = await request(app)
      .get(path)
      .set('Authorization', token);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('status');
    expect(typeof body.status === 'string').toBe(true);
  });
});

// createFriendRequest
describe('POST /friendships/:userId', () => {
  test('should return status 400 when were already friend', async () => {
    const path = `/friendships/${mockData.relation.from}`;
    const { statusCode, body } = await request(app)
      .post(path)
      .send({ friendId: mockData.relation.to })
      .set('Authorization', token);

    expect(statusCode).toBe(400);
    expect(body).toEqual({
      message: 'Both of you were friend or requested',
    });
  });

  test('should return status 201 if request successfully', async () => {
    const path = `/friendships/${mockData.relation.from}`;
    const { statusCode, body } = await request(app)
      .post(path)
      .send({ friendId: new Types.ObjectId() })
      .set('Authorization', token);

    expect(statusCode).toBe(201);
    expect(body).toHaveProperty('friendship');
    expect(typeof body.friendship === 'object').toBe(true);

    await FriendshipModel.findByIdAndDelete(body.friendship._id);
  });
});

// acceptFriendRequest
describe('PATCH /friendships/:userId', () => {
  test('should return status 404 if request is not existed', async () => {
    const path = `/friendships/${new Types.ObjectId()}`;
    const { statusCode, body } = await request(app)
      .patch(path)
      .send({ friendId: new Types.ObjectId() })
      .set('Authorization', token);

    expect(statusCode).toBe(404);
    expect(body).toEqual({
      message: 'Friend request is not existed.',
    });
  });

  test('should return status 200 if update successfully', async () => {
    const path = `/friendships/${mockData.relation.to}`;
    const { statusCode, body } = await request(app)
      .patch(path)
      .send({ friendId: mockData.relation.from })
      .set('Authorization', token);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('friendship');
    expect(typeof body.friendship === 'object').toBe(true);
  });

  test('should return status 400 if they were friend', async () => {
    const path = `/friendships/${mockData.relation.to}`;

    await FriendshipModel.findByIdAndUpdate(mockData.relation._id, {
      status: 'accepted',
    });

    const { statusCode, body } = await request(app)
      .patch(path)
      .send({ friendId: mockData.relation.from })
      .set('Authorization', token);

    expect(statusCode).toBe(400);
    expect(body).toEqual({ message: 'Both of you were friend.' });
  });
});

// rejectOrUnFriend
describe('DELETE /friendships/:userId', () => {
  test('should return status 200 if update successfully', async () => {
    const path = `/friendships/${mockData.relation.from}`;
    const { statusCode, body } = await request(app)
      .delete(path)
      .send({ friendId: mockData.relation.to })
      .set('Authorization', token);

    expect(statusCode).toBe(200);
    expect(body).toEqual({ message: 'Delete friendship successfully' });
  });
});
