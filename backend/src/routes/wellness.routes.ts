import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { WellnessProgressModel } from "../models/WellnessProgress";
import { asyncHandler } from "../utils/asyncHandler";

export const wellnessRouter = Router();

wellnessRouter.use(requireAuth);

wellnessRouter.get(
  "/progress",
  asyncHandler(async (req, res) => {
    const progress = await WellnessProgressModel.findOne({ userId: req.user!.userId });

    if (!progress) {
      return res.json({
        progress: {
          streakDays: 0,
          totalCheckins: 0,
          totalJournalEntries: 0,
          averagePositivity: 0,
          lastActiveAt: new Date().toISOString()
        }
      });
    }

    return res.json({ progress });
  })
);
