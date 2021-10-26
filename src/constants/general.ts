import { body, ValidationChain } from 'express-validator';

export const bodyStringExist = (field: string): ValidationChain =>
  body(field)
    .exists()
    .withMessage('must exist')
    .bail()
    .isString()
    .withMessage('- should be a string.');
