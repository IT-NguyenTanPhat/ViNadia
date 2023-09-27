import jwt from 'jsonwebtoken';
import { UserModel } from '../user';
import { NextFunction, Request, Response } from 'express';

export const verifyToken = async (
  req: Request,
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

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
