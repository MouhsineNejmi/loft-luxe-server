import { genSalt, hash } from 'bcrypt';
import config from 'config';
import { User } from '@prisma/client';

import { signJwt } from '../utils/jwt';
import prisma from '../lib/prisma';

interface CreateUserProps {
  username: string;
  email: string;
  password: string;
}

export const existingUser = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  return user ? true : false;
};

export const findUser = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  return user;
};

export const findUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
};

export const createUserService = async ({
  username,
  email,
  password,
}: CreateUserProps) => {
  const salt = await genSalt(12);
  const hashedPassword = await hash(password, salt);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      image: '',
      emailVerified: false,
    },
  });

  return user;
};

export const signToken = async (user: User | null) => {
  if (!user) {
    return { access_token: null, refresh_token: null };
  }

  const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
    expiresIn: `${config.get<number>('accessTokenExpiresIn')}h`,
  });

  const refresh_token = signJwt({ sub: user.id }, 'refreshTokenPrivateKey', {
    expiresIn: `${config.get<number>('refreshTokenExpiresIn')}h`,
  });

  return { access_token, refresh_token };
};
