import { Router } from "express";
import { getMoodHistory, submitMoodCheckin } from "../controllers/mood.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { moodCheckinSchema } from "../validators/mood.validator";

export const moodRouter = Router();

moodRouter.use(requireAuth);
moodRouter.post("/checkin", validateBody(moodCheckinSchema), submitMoodCheckin);
moodRouter.get("/history", getMoodHistory);
