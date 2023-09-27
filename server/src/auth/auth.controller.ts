import { UserModel } from '../user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { generateAccessToken } from '../utils/access_token';
import { catchAsync } from '../middlewares';

export const AuthController = {
  // POST /auth/login
  login: catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user
    const userWithPassword = await UserModel.findOne(
      { email },
      '-__v -createdAt -updatedAt'
    );
    if (!userWithPassword)
      return res.status(400).json({ message: 'Invalid email or password.' });

    // Compare password
    const isPasswordMatched = await bcrypt.compare(
      password,
      userWithPassword.password
    );
    if (!isPasswordMatched)
      return res.status(400).json({ message: 'Invalid email or password.' });

    // Generate tokens
    const accessToken = generateAccessToken({
      _id: userWithPassword._id,
    });

    const refreshToken = jwt.sign(
      { _id: userWithPassword._id },
      process.env.JWT_SECRET || 'vinadia_refresh_token',
      { expiresIn: '30d' }
    );

    const { password: del, ...userWithoutPassword } =
      userWithPassword.toObject(); // Remove password

    res
      .status(200)
      .json({ user: userWithoutPassword, accessToken, refreshToken });
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

    const accessToken = generateAccessToken({ _id: verified._id });

    res.status(200).json({ token: accessToken });
  }),
};
