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
