import { body } from 'express-validator';

export const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email must be a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isString()
    .withMessage('password must be a string'),
];

export const registerValidator = [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .isString()
    .withMessage('name must be a string'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email must be a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isString()
    .withMessage('password must be a string'),
];

export const refreshTokenValidator = [
  body('token')
    .notEmpty()
    .withMessage('token is required')
    .isString()
    .withMessage('token must be a string'),
];
