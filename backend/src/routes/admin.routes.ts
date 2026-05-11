import { Router } from "express";
import { getAdminAnalytics } from "../controllers/admin.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));
adminRouter.get("/analytics", getAdminAnalytics);
