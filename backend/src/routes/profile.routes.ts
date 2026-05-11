import { Router } from "express";
import { getProfile, updateProfile, deleteAccount } from "../controllers/profile.controller";
import { requireAuth } from "../middleware/auth.middleware";

export const profileRouter = Router();

profileRouter.use(requireAuth);
profileRouter.get("/", getProfile);
profileRouter.patch("/", updateProfile);
profileRouter.delete("/", deleteAccount);
