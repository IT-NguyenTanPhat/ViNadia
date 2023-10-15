import { param } from 'express-validator';

export const userIdValidator = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('userId must be a valid ID'),
];
