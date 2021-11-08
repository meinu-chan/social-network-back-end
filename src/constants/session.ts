import { cookie } from 'express-validator';
import { bodyStringExist } from './general';
import { emailRegex, fullNameRegex, passwordRegex } from './user';

export const validateSignUp = [
  bodyStringExist('fullName').matches(fullNameRegex),
  bodyStringExist('password').matches(passwordRegex),
  bodyStringExist('email').matches(emailRegex),
];

export const validateSignIn = [
  bodyStringExist('password').matches(passwordRegex),
  bodyStringExist('email').matches(emailRegex),
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
