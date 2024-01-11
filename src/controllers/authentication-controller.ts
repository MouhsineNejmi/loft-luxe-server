// require('dotenv').config();
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { compare } from 'bcrypt';

import {
  createUserService,
  existingUser,
  findUser,
  findUserById,
  signToken,
} from '../services/users-service';
import { signJwt, verifyJwt } from '../utils/jwt';

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
    Date.now() +
      parseInt(`${process.env.ACCESS_TOKEN_EXPIRES_IN}`) * 3600 * 1000
  ),
  maxAge: parseInt(`${process.env.ACCESS_TOKEN_EXPIRES_IN}`) * 3600 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

const refreshTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() +
      parseInt(`${process.env.REFRESH_TOKEN_EXPIRES_IN}`) * 3600 * 1000
  ),
  maxAge: parseInt(`${process.env.REFRESH_TOKEN_EXPIRES_IN}`) * 3600 * 1000,
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

    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid username or password',
      });
    }

    const { access_token, refresh_token } = await signToken(user);

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

export const refreshAccessTokenController = async (
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
      return res.status(500).json({
        status: 'fail',
        message,
      });
    }

    const user = await findUserById(decoded.sub);

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    const access_token = signJwt(
      { sub: user.id },
      `${process.env.ACCESS_TOKEN_KEY}`,
      {
        expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}h`,
      }
    );

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

export const logoutUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logout(res);
    return res
      .status(200)
      .json({ status: 'success', message: 'User logged out successfully!' });
  } catch (err: any) {
    next(err);
  }
};
