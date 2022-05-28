import { query } from 'express-validator';
import { bodyStringExist, isValidDate, validateMongoId } from './general';

export const validatePostCreate = [bodyStringExist('text'), ...validateMongoId];

export const validatePostRemove = validateMongoId;

export const validatePostList = [
  ...validateMongoId,
  query('limit')
    .exists()
    .withMessage('- per page limit is not passed')
    .bail()
    .isInt({ gt: 0 })
    .withMessage('- per page limit should be greater then 0'),
  query('createdAt')
    .optional()
    .isString()
    .withMessage('- should be a string.')
    .bail()
    .custom(isValidDate),
];
