import { param, query } from 'express-validator';
import { bodyStringExist, isValidMongoId } from './general';

export const validateListMessage = [
  param('chat')
    .exists()
    .withMessage('- must exist.')
    .bail()
    .isString()
    .withMessage('- should be a string.')
    .bail()
    .custom(isValidMongoId),
  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('- should be integer greater than 0.')
    .customSanitizer((v) => +v),
];

export const validateCreateMessage = [
  param('chat')
    .exists()
    .withMessage('- must exist.')
    .bail()
    .isString()
    .withMessage('- should be a string.')
    .bail()
    .custom(isValidMongoId),
  bodyStringExist('text'),
];
