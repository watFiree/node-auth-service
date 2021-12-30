import { Request } from "express";

export interface UserFields {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface RegisterRequest extends Request {
  body: UserFields;
}

export interface LoginRequest extends Request {
  body: Omit<UserFields, "passwordConfirmation">;
}
