import { UserModel } from '../models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { catchAsync } from '../middlewares';
import axios from 'axios';
import { ggClient } from '../config/google';

function generateAccessToken(userId: string) {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'vinadia_access_token',
    { expiresIn: '8h' }
  );
  return accessToken;
}

function generateRefreshToken(userId: string) {
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'vinadia_refresh_token',
    { expiresIn: '7d' }
  );
  return refreshToken;
}

export const AuthController = {
  // POST /auth/login
  login: catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user
    const userWithPassword = await UserModel.findOne(
      { email },
      '-__v -createdAt -updatedAt'
    );
    if (!userWithPassword || !userWithPassword.password)
      return res.status(400).json({ message: 'Invalid email or password.' });

    // Compare password
    const isPasswordMatched = await bcrypt.compare(
      password,
      userWithPassword.password
    );
    if (!isPasswordMatched)
      return res.status(400).json({ message: 'Invalid email or password.' });

    // Generate tokens
    const accessToken = generateAccessToken(userWithPassword._id.toString());
    const refreshToken = generateRefreshToken(userWithPassword._id.toString());

    const { password: del, ...userWithoutPassword } =
      userWithPassword.toObject(); // Remove password

    res
      .status(200)
      .json({ user: userWithoutPassword, accessToken, refreshToken });
  }),

  // GET /auth/google
  google: catchAsync(async (req: Request, res: Response) => {
    const code = req.query.code as string;

    const googleRes = await ggClient.getToken(code);
    ggClient.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json`,
      { headers: { Authorization: 'Bearer ' + googleRes.tokens.access_token } }
    );

    let user = await UserModel.findOne({ email: userRes.data.email });

    if (!user) {
      user = await UserModel.create({
        name: userRes.data.name,
        email: userRes.data.email,
        avatar: userRes.data.picture,
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.status(200).json({ user, accessToken, refreshToken });
  }),

  // POST /auth/register
  register: catchAsync(async (req: Request, res: Response) => {
    // Check existed user
    const isExist = await UserModel.exists({ email: req.body.email });
    if (isExist)
      return res.status(400).json({ message: 'Email is already existed.' });
    const userWithPassword = await UserModel.create({ ...req.body });
    const { password, ...userWithoutPassword } = userWithPassword.toObject(); // Remove password
    res.status(201).json({ user: userWithoutPassword });
  }),

  // POST /auth/refresh-token
  refreshToken: catchAsync(async (req: Request, res: Response) => {
    const refresh_token = req.body.token;

    if (!refresh_token)
      return res.status(403).json({ message: 'Missing token' });

    // Verify refresh token
    const verified = jwt.verify(
      refresh_token,
      process.env.JWT_SECRET || 'vinadia_refresh_token'
    );
    if (typeof verified === 'string')
      return res.status(403).json({ message: 'Invalid token' });

    const accessToken = generateAccessToken(verified.userId);

    res.status(200).json({ token: accessToken });
  }),
};
