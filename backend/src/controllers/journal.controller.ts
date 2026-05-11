import { Request, Response } from "express";
import { AIAnalysisModel } from "../models/AIAnalysis";
import { JournalModel } from "../models/Journal";
import { WellnessProgressModel } from "../models/WellnessProgress";
import { analyzeEmotion } from "../services/ai.service";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const createJournal = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const ai = await analyzeEmotion(req.body.content);

  const journal = await JournalModel.create({
    userId,
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    emotionalState: ai.emotionalState,
    positivityScore: ai.positivityScore,
    aiInsights: ai.suggestions
  });

  await AIAnalysisModel.create({
    userId,
    source: "journal",
    rawText: req.body.content,
    emotionalState: ai.emotionalState,
    positivityScore: ai.positivityScore,
    suggestions: ai.suggestions
  });

  await WellnessProgressModel.findOneAndUpdate(
    { userId },
    {
      $inc: { totalJournalEntries: 1 },
      $set: { lastActiveAt: new Date() }
    },
    { upsert: true, new: true }
  );

  res.status(201).json({ journal });
});

export const getJournals = asyncHandler(async (req: Request, res: Response) => {
  const search = (req.query.search as string) || "";

  const query = {
    userId: req.user!.userId,
    $or: [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } }
    ]
  };

  const journals = await JournalModel.find(query).sort({ createdAt: -1 });
  res.json({ journals });
});

export const updateJournal = asyncHandler(async (req: Request, res: Response) => {
  const journal = await JournalModel.findOne({
    _id: req.params.id,
    userId: req.user!.userId
  });

  if (!journal) {
    throw new ApiError(404, "Journal not found");
  }

  if (req.body.title) {
    journal.title = req.body.title;
  }
  if (req.body.content) {
    journal.content = req.body.content;
  }
  if (req.body.tags) {
    journal.tags = req.body.tags;
  }

  if (req.body.content) {
    const ai = await analyzeEmotion(req.body.content);
    journal.emotionalState = ai.emotionalState;
    journal.positivityScore = ai.positivityScore;
    journal.aiInsights = ai.suggestions;
  }

  await journal.save();
  res.json({ journal });
});

export const deleteJournal = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await JournalModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!.userId
  });

  if (!deleted) {
    throw new ApiError(404, "Journal not found");
  }

  res.json({ message: "Journal deleted" });
});
