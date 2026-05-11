import { Request, Response } from "express";
import { AIAnalysisModel } from "../models/AIAnalysis";
import { MoodLogModel } from "../models/MoodLog";
import { WellnessProgressModel } from "../models/WellnessProgress";
import { analyzeEmotion } from "../services/ai.service";
import { asyncHandler } from "../utils/asyncHandler";

export const submitMoodCheckin = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const textPayload = `anxiety:${req.body.anxiety}, fear:${req.body.fear}, stress:${req.body.stress}, depression:${req.body.depression}, sleep:${req.body.sleepQuality}, motivation:${req.body.motivation}, pain:${req.body.painLevel}, note:${req.body.freeText}`;

  const ai = await analyzeEmotion(textPayload);

  const mood = await MoodLogModel.create({
    userId,
    anxiety: req.body.anxiety,
    fear: req.body.fear,
    stress: req.body.stress,
    depression: req.body.depression,
    sleepQuality: req.body.sleepQuality,
    motivation: req.body.motivation,
    painLevel: req.body.painLevel,
    emotionalState: ai.emotionalState,
    positivityScore: ai.positivityScore,
    aiSuggestions: ai.suggestions,
    rawInput: textPayload
  });

  await AIAnalysisModel.create({
    userId,
    source: "mood-checkin",
    rawText: textPayload,
    emotionalState: ai.emotionalState,
    positivityScore: ai.positivityScore,
    suggestions: ai.suggestions
  });

  const progress = await WellnessProgressModel.findOneAndUpdate(
    { userId },
    {
      $inc: { totalCheckins: 1 },
      $set: { lastActiveAt: new Date() },
      $setOnInsert: { streakDays: 1 }
    },
    { upsert: true, new: true }
  );

  res.status(201).json({ mood, progress });
});

export const getMoodHistory = asyncHandler(async (req: Request, res: Response) => {
  const moods = await MoodLogModel.find({ userId: req.user!.userId })
    .sort({ createdAt: -1 })
    .limit(30);
  res.json({ moods });
});
