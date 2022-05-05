import { body, query } from 'express-validator';
import { bodyStringExist, isValidMongoId } from './general';

export const validateStartChat = [
  bodyStringExist('withUser').custom(isValidMongoId),
  body('isPrivate').optional().isBoolean().withMessage('- should be a boolean.'),
];

export const validateListChat = [
  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('- should be integer greater than 0.')
    .customSanitizer((v) => +v),
];
