require('dotenv').config();
import jwt, { SignOptions } from 'jsonwebtoken';

export const signJwt = (
  payload: Object,
  key: string,
  options: SignOptions = {}
) => {
  return jwt.sign(payload, key);
};

export const verifyJwt = <T>(token: string, key: string): T | null => {
  try {
    return jwt.verify(token, key) as T;
  } catch (error) {
    console.log('Utils jwt catch error: ', error);
    return null;
  }
};
