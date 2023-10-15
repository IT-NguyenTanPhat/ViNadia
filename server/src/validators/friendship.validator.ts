import { body, param } from 'express-validator';

export const getUserFriendsValidator = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('userId must be a valid ID'),
];

export const getFriendStatusValidator = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('userId must be a valid ID'),
  param('friendId')
    .notEmpty()
    .withMessage('friendId is required')
    .isMongoId()
    .withMessage('friendId must be a valid ID'),
];

export const friendRequestValidator = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('userId must be a valid ID'),
  body('friendId')
    .notEmpty()
    .withMessage('friendId is required')
    .isMongoId()
    .withMessage('friendId must be a valid ID'),
];
