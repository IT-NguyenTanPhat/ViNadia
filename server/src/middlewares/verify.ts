import jwt from 'jsonwebtoken';
import { UserModel } from '../models';
import { NextFunction, Request, Response } from 'express';
import { VerifiedRequest } from '../types/request';

export const verifyToken = async (
  req: VerifiedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.header('Authorization');
    if (!token) throw new Error();
    if (token.startsWith('Bearer '))
      token = token.slice(7, token.length).trimStart();
    if (!token) throw new Error();

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || 'vinadia_access_token'
    );
    if (typeof verified === 'string') throw new Error();

    const isExisted = await UserModel.exists({ _id: verified['_id'] });
    if (!isExisted) throw new Error();

    req.userId = verified['_id'];

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
