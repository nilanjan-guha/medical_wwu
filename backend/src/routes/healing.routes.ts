import { Router } from "express";
import {
  createHealingSession,
  listHealingSessions
} from "../controllers/healing.controller";
import { requireAuth } from "../middleware/auth.middleware";

export const healingRouter = Router();

healingRouter.use(requireAuth);
healingRouter.get("/sessions", listHealingSessions);
healingRouter.post("/sessions", createHealingSession);
