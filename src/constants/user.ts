import { query } from 'express-validator';
import { bodyStringOptional, validateMongoId, validatePaginationQuery } from './general';

export const emailRegex = /^\S+@\S+\.\S+$/;

export const fullNameRegex = /^([0-9\p{L}]+([-,`.\s;=']?))+$/u;

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\\\/\-\[\]`^=_<>;:,.+()'"#|@$!%*?&])[A-Za-z\d\\\/\-\[\]`^=_<>;:,.+()'"#|@$!%*?&]{8,}$/;

export const roles: string[] = ['user', 'admin'];

export const validateShowUser = validateMongoId;

export const validateUpdateMeUser = [
  bodyStringOptional('fullName'),
  bodyStringOptional('nickname'),
  bodyStringOptional('photo'),
  bodyStringOptional('backgroundAvatar'),
];

export const validateListUser = validatePaginationQuery;

export const validateNonPaginatedListUser = [
  query('field').optional().isString().withMessage('- should be a string.').bail(),
];
