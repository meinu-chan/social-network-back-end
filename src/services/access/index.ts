import { Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors';
import User from '../../api/user/model';
import { verify } from '../jwt/index';
import { AuthRequest } from '../../types/common/auth-request';

interface UserInToken {
  _id: string;
  email: string;
  fullName: string;
  iat: number;
  exp: number;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;
    const auth = req.headers.authorization as string;

    if (auth && auth.startsWith('Bearer')) {
      token = auth.split(' ')[1];
    }

    if (req.body.accessToken) {
      token = req.body.accessToken;
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    const userInToken: UserInToken | false = await verify(token);

    if (!userInToken) {
      return next(new AppError('Token verification error.', 401));
    }

    const currentUser = await User.findById(userInToken._id);

    if (!currentUser) {
      return next(new AppError("The user belonging to this token doesn't longer exist.", 401));
    }

    req.user = currentUser;

    next();
  } catch (err: any) {
    next(err);
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission to perform this action.", 403));
    }

    next();
  };
};
