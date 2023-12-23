import { CookieOptions, NextFunction, Request, Response } from 'express';
import config from 'config';
import { compare } from 'bcrypt';

import {
  createUserService,
  existingUser,
  findUser,
  findUserById,
  signToken,
} from '../services/user-service';
import { signJwt, verifyJwt } from '../utils/jwt';
import AppError from '../utils/appError';

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  try {
    const isUserExist = await existingUser(data.username);

    if (isUserExist) {
      return res.status(400).json({
        status: 'fail',
        message: 'User with this username or email already exist',
      });
    }

    const user = await createUserService(data);

    return res.status(201).json({
      status: 'success',
      user,
    });
  } catch (error) {
    next(error);
  }
};

const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

const refreshTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>('refreshTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('refreshTokenExpiresIn') * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

if (process.env.NODE_ENV === 'production')
  accessTokenCookieOptions.secure = true;

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const user = await findUser(username);

    if (!user || !(await compare(user.password, password))) {
      next(new AppError('Invalid username or password', 403));
    }

    // Create the Access and refresh Tokens
    const { access_token, refresh_token } = await signToken(user);

    // Send Access Token in Cookie
    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    return res.status(200).json({
      status: 'success',
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the refresh token from cookie
    const refresh_token = req.cookies.refresh_token as string;

    // Validate the Refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      'refreshTokenPublicKey'
    );

    const message = 'Could not refresh access token';
    if (!decoded) {
      return next(new AppError(message, 403));
    }

    const user = await findUserById(decoded.sub);

    if (!user) {
      return next(new AppError(message, 403));
    }

    const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    return res.status(200).json({
      status: 'success',
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

const logout = (res: Response) => {
  res.cookie('access_token', '', { maxAge: 1 });
  res.cookie('refresh_token', '', { maxAge: 1 });
  res.cookie('logged_in', '', {
    maxAge: 1,
  });
};

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logout(res);
    return res.status(200).json({ status: 'success' });
  } catch (err: any) {
    next(err);
  }
};
