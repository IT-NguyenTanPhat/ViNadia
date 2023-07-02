import { UserModel } from '../user/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const AuthController = {
  // POST /auth/login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne(
        { email },
        '-__v -createdAt -updatedAt'
      );
      if (!user)
        return res.status(400).json({ message: 'Invalid email or password.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: 'Invalid email or password.' });

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      user.password = undefined;
      res.status(200).json({ user, token });
    } catch (error) {
      console.log(`login: ${error}`);
      res
        .status(500)
        .json({ message: 'Something went wrong. Please, try later!' });
    }
  },

  // POST /auth/register
  register: async (req, res) => {
    try {
      const isExist = await UserModel.exists({ email: req.body.email });
      if (isExist)
        return res.status(400).json({ message: 'Email is already existed.' });
      const user = await UserModel.create({ ...req.body });
      user.password = undefined;
      res.status(201).json(user);
    } catch (error) {
      console.log(`register: ${error}`);
      res
        .status(500)
        .json({ message: 'Something went wrong. Please, try later!' });
    }
  },
};
