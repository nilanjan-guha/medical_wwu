import { NextFunction, Request, Response } from "express";
import { MongoServerError } from "mongodb";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Keep a server-side trace for debugging unexpected 500s.
  // eslint-disable-next-line no-console
  console.error(`[${req.method} ${req.originalUrl}]`, err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      issues: err.issues
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof MongoServerError) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (err.code === 13 || /not authorized/i.test(err.message)) {
      return res.status(500).json({
        message:
          "Database user is connected but does not have write permission for signup. Grant readWrite on this database in MongoDB Atlas."
      });
    }
  }

  return res.status(500).json({
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message
  });
};
