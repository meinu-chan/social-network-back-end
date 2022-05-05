import { param, query } from 'express-validator';
import { bodyStringExist, isValidMongoId, validateMongoId } from './general';

export const validateListMessage = [
  param('chat')
    .exists()
    .withMessage('- must exist.')
    .bail()
    .isString()
    .withMessage('- should be a string.')
    .bail()
    .custom(isValidMongoId),
  query('date').optional().isISO8601().toDate(),
  query('operator')
    .optional()
    .isString()
    .withMessage('- should be a string')
    .bail()
    .isIn(['-', '+'])
    .withMessage("- should be '+'/'-'."),
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

export const validateReadMessage = validateMongoId;
