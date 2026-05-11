import { Router } from "express";
import { authRouter } from "./auth.routes";
import { moodRouter } from "./mood.routes";
import { journalRouter } from "./journal.routes";
import { healingRouter } from "./healing.routes";
import { notificationsRouter } from "./notifications.routes";
import { profileRouter } from "./profile.routes";
import { emergencyRouter } from "./emergency.routes";
import { adminRouter } from "./admin.routes";
import { wellnessRouter } from "./wellness.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/mood", moodRouter);
apiRouter.use("/journals", journalRouter);
apiRouter.use("/healing", healingRouter);
apiRouter.use("/notifications", notificationsRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/emergency", emergencyRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/wellness", wellnessRouter);
