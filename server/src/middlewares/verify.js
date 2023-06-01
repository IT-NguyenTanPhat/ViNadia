import jwt from 'jsonwebtoken';
import { UserModel } from '../user/index.js';

export const verifyToken = (req, res, next) => {
  try {
    let token = req.header('Authorization');
    if (!token) return res.status(403).send('Access Denied');
    if (token.startsWith('Bearer '))
      token = token.slice(7, token.length).trimStart();

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const isExisted = UserModel.exists({ _id: verified._id });
    
    if (!isExisted) return res.status(403).send('Access Denied');

    req.user = verified;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Invalid token' });
  }
};
