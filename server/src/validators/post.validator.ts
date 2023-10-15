import { body, param } from 'express-validator';

export const createPostValidator = [
  body('author')
    .notEmpty()
    .withMessage('author is required')
    .isMongoId()
    .withMessage('author must be a valid ID'),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string'),
];

export const likeOrDislikePostValidator = [
  body('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('userId must be a valid ID'),
  param('postId')
    .notEmpty()
    .withMessage('postId is required')
    .isMongoId()
    .withMessage('postId must be a valid ID'),
];
