import { Router } from "express";
import {
  listNotificationPreferences,
  upsertNotificationPreference
} from "../controllers/notification.controller";
import { requireAuth } from "../middleware/auth.middleware";

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);
notificationsRouter.get("/preferences", listNotificationPreferences);
notificationsRouter.post("/preferences", upsertNotificationPreference);
