import app from '../src/app';
import request from 'supertest';
import { UserModel } from '../src/user';

let mockUser: any;

beforeEach(async () => {
  mockUser = await UserModel.create({
    name: 'fake',
    email: 'fake@email.com',
    password: 'fake',
  });
});

afterEach(async () => {
  await UserModel.findByIdAndDelete(mockUser._id);
});

// login
describe('POST /auth/login', () => {
  const path = '/auth/login';

  test('should return status 400 if user does not exist', async () => {
    const { statusCode, body } = await request(app).post(path).send({
      email: 'test',
      password: 'test',
    });

    expect(statusCode).toBe(400);
    expect(body).toEqual({ message: 'Invalid email or password.' });
  });

  test('should return status 400 if password does not match', async () => {
    const { statusCode, body } = await request(app).post(path).send({
      email: 'fake@email.com',
      password: 'test',
    });

    expect(statusCode).toBe(400);
    expect(body).toEqual({ message: 'Invalid email or password.' });
  });

  test('should return status 200 and a token if login successfully', async () => {
    const { statusCode, body } = await request(app).post(path).send({
      email: 'fake@email.com',
      password: 'fake',
    });

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('user');
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
  });
});

// register
describe('POST /auth/register', () => {
  const path = '/auth/register';

  test('should return status 400 if user existed', async () => {
    const { statusCode, body } = await request(app).post(path).send({
      name: 'fake',
      email: 'fake@email.com',
      password: 'test',
    });

    expect(statusCode).toBe(400);
    expect(body).toEqual({ message: 'Email is already existed.' });
  });

  test('should return status 201 if register successfully', async () => {
    const { statusCode, body } = await request(app).post(path).send({
      name: 'fake',
      email: 'new@email.com',
      password: 'fake',
    });

    expect(statusCode).toBe(201);
    expect(body).toHaveProperty('user');
    expect(typeof body.user === 'object').toBe(true);

    await UserModel.findOneAndDelete({ email: 'new@email.com' });
  });
});
