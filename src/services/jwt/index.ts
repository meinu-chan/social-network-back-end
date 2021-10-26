import jwt from 'jsonwebtoken';
import { jwtSecret, jwtExpiresIn } from '../../config/access';

export const signToken = (_id: string): string =>
  jwt.sign({ _id }, jwtSecret, { expiresIn: jwtExpiresIn });

export const verify = (token: string): any => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    return false;
  }
};
