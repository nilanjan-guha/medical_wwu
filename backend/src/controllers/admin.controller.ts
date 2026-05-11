import { Request, Response } from "express";
import { MoodLogModel } from "../models/MoodLog";
import { UserModel } from "../models/User";
import { WellnessProgressModel } from "../models/WellnessProgress";
import { asyncHandler } from "../utils/asyncHandler";

export const getAdminAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const [totalUsers, activeUsers, moodTrends, engagement] = await Promise.all([
    UserModel.countDocuments(),
    WellnessProgressModel.countDocuments({
      lastActiveAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }),
    MoodLogModel.aggregate([
      {
        $group: {
          _id: "$emotionalState",
          count: { $sum: 1 },
          avgPositivity: { $avg: "$positivityScore" }
        }
      },
      { $sort: { count: -1 } }
    ]),
    WellnessProgressModel.aggregate([
      {
        $group: {
          _id: null,
          avgStreak: { $avg: "$streakDays" },
          avgPositivity: { $avg: "$averagePositivity" },
          totalCheckins: { $sum: "$totalCheckins" }
        }
      }
    ])
  ]);

  res.json({
    totalUsers,
    activeUsers,
    moodTrends,
    engagement: engagement[0] || {
      avgStreak: 0,
      avgPositivity: 0,
      totalCheckins: 0
    }
  });
});
