import { InferType, object, string } from 'yup';

export const createUserSchema = object({
  body: object({
    username: string().required(),
    email: string().required().email('Invalid email'),
    password: string()
      .required()
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
  }),
});

export const loginUserSchema = object({
  body: object({
    username: string().required(),
    password: string()
      .required()
      .min(8, 'Invalid username or password')
      .max(32, 'Password must be less than 32 characters'),
  }),
});

export type CreateUserInput = InferType<typeof createUserSchema>;
export type LoginUserInput = InferType<typeof loginUserSchema>;
