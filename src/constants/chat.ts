import { body } from 'express-validator';
import { bodyStringExist, isValidMongoId } from './general';

export const validateStartChat = [
  bodyStringExist('withUser').custom(isValidMongoId),
  body('isPrivate').optional().isBoolean().withMessage('- should be a boolean.'),
];
