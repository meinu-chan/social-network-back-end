import { cookie } from 'express-validator';
import { bodyStringExist, bodyStringOptional, isValidDate } from './general';
import { emailRegex, fullNameRegex, passwordRegex, phoneRegex } from './user';

export const validateSignUp = [
  bodyStringExist('fullName').matches(fullNameRegex),
  bodyStringExist('password').matches(passwordRegex),
  bodyStringExist('email').matches(emailRegex),
  bodyStringOptional('nickname'),
  bodyStringOptional('photo'),
  bodyStringOptional('phone').matches(phoneRegex),
  bodyStringOptional('job'),
  bodyStringOptional('school'),
  bodyStringOptional('university'),
  bodyStringOptional('country.name'),
  bodyStringOptional('country.flag'),
  bodyStringOptional('birthday').custom(isValidDate),
];

export const validateSignIn = [
  bodyStringExist('password').matches(passwordRegex),
  bodyStringExist('email').matches(emailRegex),
  bodyStringOptional('nickname'),
];

export const validateLogOut = [
  cookie('refreshToken')
    .exists()
    .withMessage('- cannot be empty')
    .bail()
    .isString()
    .withMessage('- should be a string.'),
];

export const validateRefreshToken = [
  cookie('refreshToken')
    .exists()
    .withMessage('- cannot be empty')
    .bail()
    .isString()
    .withMessage('- should be a string.'),
  ,
];
