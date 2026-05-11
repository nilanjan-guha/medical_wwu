import { Request, Response } from "express";
import { HealingSessionModel } from "../models/HealingSession";
import { asyncHandler } from "../utils/asyncHandler";

export const listHealingSessions = asyncHandler(async (req: Request, res: Response) => {
  const sessions = await HealingSessionModel.find({ userId: req.user!.userId })
    .sort({ createdAt: -1 })
    .limit(20);
  res.json({ sessions });
});

export const createHealingSession = asyncHandler(async (req: Request, res: Response) => {
  const session = await HealingSessionModel.create({
    userId: req.user!.userId,
    type: req.body.type,
    durationSeconds: req.body.durationSeconds,
    completed: req.body.completed ?? false,
    favorited: req.body.favorited ?? false
  });
  res.status(201).json({ session });
});
