import { Request } from "express";

export type RegisterRequest = Request<
  {},
  {},
  {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }
>;

export type LoginRequest = Request<
  {},
  {},
  {
    username: string;
    email: string;
    password: string;
  }
>;
