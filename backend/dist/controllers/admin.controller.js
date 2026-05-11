"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminAnalytics = void 0;
const MoodLog_1 = require("../models/MoodLog");
const User_1 = require("../models/User");
const WellnessProgress_1 = require("../models/WellnessProgress");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getAdminAnalytics = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const [totalUsers, activeUsers, moodTrends, engagement] = await Promise.all([
        User_1.UserModel.countDocuments(),
        WellnessProgress_1.WellnessProgressModel.countDocuments({
            lastActiveAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }),
        MoodLog_1.MoodLogModel.aggregate([
            {
                $group: {
                    _id: "$emotionalState",
                    count: { $sum: 1 },
                    avgPositivity: { $avg: "$positivityScore" }
                }
            },
            { $sort: { count: -1 } }
        ]),
        WellnessProgress_1.WellnessProgressModel.aggregate([
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
