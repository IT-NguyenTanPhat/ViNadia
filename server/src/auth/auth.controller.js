import { UserModel } from '../user/index.js';
import jwt from 'jsonwebtoken';

export const AuthController = {
  // POST /auth/login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user)
        return res.status(400).json({ message: 'Invalid email or password.' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(400).json({ message: 'Invalid email or password.' });

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      delete user.password;
      res.status(200).json({ user, token });
    } catch (error) {
      console.error(error);
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
      const user = await UserModel.create({
        ...req.body,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      });
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Something went wrong. Please, try later!' });
    }
  },
};
