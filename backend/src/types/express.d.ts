import "express";

declare global {
  namespace Express {
    interface UserToken {
      userId: string;
      email: string;
      role: "user" | "admin";
    }

    interface Request {
      user?: UserToken;
    }
  }
}

export {};
