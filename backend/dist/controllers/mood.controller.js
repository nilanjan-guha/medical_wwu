"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoodHistory = exports.submitMoodCheckin = void 0;
const AIAnalysis_1 = require("../models/AIAnalysis");
const MoodLog_1 = require("../models/MoodLog");
const WellnessProgress_1 = require("../models/WellnessProgress");
const ai_service_1 = require("../services/ai.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.submitMoodCheckin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.userId;
    const textPayload = `anxiety:${req.body.anxiety}, fear:${req.body.fear}, stress:${req.body.stress}, depression:${req.body.depression}, sleep:${req.body.sleepQuality}, motivation:${req.body.motivation}, pain:${req.body.painLevel}, note:${req.body.freeText}`;
    const ai = await (0, ai_service_1.analyzeEmotion)(textPayload);
    const mood = await MoodLog_1.MoodLogModel.create({
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
    await AIAnalysis_1.AIAnalysisModel.create({
        userId,
        source: "mood-checkin",
        rawText: textPayload,
        emotionalState: ai.emotionalState,
        positivityScore: ai.positivityScore,
        suggestions: ai.suggestions
    });
    const progress = await WellnessProgress_1.WellnessProgressModel.findOneAndUpdate({ userId }, {
        $inc: { totalCheckins: 1 },
        $set: { lastActiveAt: new Date() },
        $setOnInsert: { streakDays: 1 }
    }, { upsert: true, new: true });
    res.status(201).json({ mood, progress });
});
exports.getMoodHistory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const moods = await MoodLog_1.MoodLogModel.find({ userId: req.user.userId })
        .sort({ createdAt: -1 })
        .limit(30);
    res.json({ moods });
});
