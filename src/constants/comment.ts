import { query } from 'express-validator';
import { bodyStringExist, isValidDate, validateMongoId } from './general';

export const validateCommentCreate = [bodyStringExist('text'), ...validateMongoId];
export const validateCommentRemove = validateMongoId;
export const validateCommentList = [
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
