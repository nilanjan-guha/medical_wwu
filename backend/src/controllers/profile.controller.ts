import { Request, Response } from "express";
import { AIAnalysisModel } from "../models/AIAnalysis";
import { EmergencyContactModel } from "../models/EmergencyContact";
import { HealingSessionModel } from "../models/HealingSession";
import { JournalModel } from "../models/Journal";
import { MoodLogModel } from "../models/MoodLog";
import { NotificationModel } from "../models/Notification";
import { UserModel } from "../models/User";
import { WellnessProgressModel } from "../models/WellnessProgress";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user!.userId).select("-password -refreshTokens");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.json({ user });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user!.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.name = req.body.name ?? user.name;
  user.healthConditions = req.body.healthConditions ?? user.healthConditions;
  user.consentForEmotionAnalysis =
    req.body.consentForEmotionAnalysis ?? user.consentForEmotionAnalysis;

  await user.save();

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      healthConditions: user.healthConditions,
      consentForEmotionAnalysis: user.consentForEmotionAnalysis
    }
  });
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await Promise.all([
    MoodLogModel.deleteMany({ userId }),
    JournalModel.deleteMany({ userId }),
    HealingSessionModel.deleteMany({ userId }),
    EmergencyContactModel.deleteMany({ userId }),
    AIAnalysisModel.deleteMany({ userId }),
    WellnessProgressModel.deleteMany({ userId }),
    NotificationModel.deleteMany({ userId })
  ]);

  await UserModel.findByIdAndDelete(userId);
  res.clearCookie("refreshToken");
  res.json({ message: "Account and related data deleted successfully" });
});
