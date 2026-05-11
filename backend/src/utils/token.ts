import jwt from "jsonwebtoken";
import { env } from "../config/env";

type Role = "user" | "admin";

interface Payload {
  userId: string;
  email: string;
  role: Role;
}

export const signAccessToken = (payload: Payload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });
};

export const signRefreshToken = (payload: Payload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });
};

export const verifyAccessToken = (token: string): Payload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as Payload;
};

export const verifyRefreshToken = (token: string): Payload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as Payload;
};
