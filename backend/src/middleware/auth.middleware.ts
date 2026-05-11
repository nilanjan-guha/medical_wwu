import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyAccessToken } from "../utils/token";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized");
  }

  const token = header.split(" ")[1];
  req.user = verifyAccessToken(token);
  next();
};

export const requireRole = (role: "admin" | "user") => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      throw new ApiError(403, "Forbidden");
    }
    next();
  };
};
