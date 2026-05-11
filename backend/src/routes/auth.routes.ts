import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  me,
  refreshToken,
  resetPassword,
  signup
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  resetPasswordSchema,
  signupSchema
} from "../validators/auth.validator";

export const authRouter = Router();

authRouter.post("/signup", validateBody(signupSchema), signup);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/refresh", validateBody(refreshSchema), refreshToken);
authRouter.post("/forgot-password", validateBody(forgotPasswordSchema), forgotPassword);
authRouter.post("/reset-password", validateBody(resetPasswordSchema), resetPassword);
authRouter.get("/me", requireAuth, me);
authRouter.post("/logout", requireAuth, logout);
