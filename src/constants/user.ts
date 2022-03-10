import { query } from 'express-validator';
import {
  bodyStringOptional,
  isValidDate,
  validateMongoId,
  validatePaginationQuery,
} from './general';

export const emailRegex = /^\S+@\S+\.\S+$/;

export const fullNameRegex = /^([0-9\p{L}]+([-,`.\s;=']?))+$/u;

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\\\/\-\[\]`^=_<>;:,.+()'"#|@$!%*?&])[A-Za-z\d\\\/\-\[\]`^=_<>;:,.+()'"#|@$!%*?&]{8,}$/;

export const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

export const roles: string[] = ['user', 'admin'];

export const validateShowUser = validateMongoId;

export const validateUpdateMeUser = [
  bodyStringOptional('fullName'),
  bodyStringOptional('nickname'),
  bodyStringOptional('photo'),
  bodyStringOptional('backgroundAvatar'),
  bodyStringOptional('phone').matches(phoneRegex),
  bodyStringOptional('job'),
  bodyStringOptional('school'),
  bodyStringOptional('university'),
  bodyStringOptional('country.name'),
  bodyStringOptional('country.flag'),
  bodyStringOptional('birthday').custom(isValidDate),
];

export const validateListUser = validatePaginationQuery;

export const validateNonPaginatedListUser = [
  query('field').optional().isString().withMessage('- should be a string.').bail(),
];
