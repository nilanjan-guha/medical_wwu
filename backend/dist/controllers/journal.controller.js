"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJournal = exports.updateJournal = exports.getJournals = exports.createJournal = void 0;
const AIAnalysis_1 = require("../models/AIAnalysis");
const Journal_1 = require("../models/Journal");
const WellnessProgress_1 = require("../models/WellnessProgress");
const ai_service_1 = require("../services/ai.service");
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.createJournal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.userId;
    const ai = await (0, ai_service_1.analyzeEmotion)(req.body.content);
    const journal = await Journal_1.JournalModel.create({
        userId,
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        emotionalState: ai.emotionalState,
        positivityScore: ai.positivityScore,
        aiInsights: ai.suggestions
    });
    await AIAnalysis_1.AIAnalysisModel.create({
        userId,
        source: "journal",
        rawText: req.body.content,
        emotionalState: ai.emotionalState,
        positivityScore: ai.positivityScore,
        suggestions: ai.suggestions
    });
    await WellnessProgress_1.WellnessProgressModel.findOneAndUpdate({ userId }, {
        $inc: { totalJournalEntries: 1 },
        $set: { lastActiveAt: new Date() }
    }, { upsert: true, new: true });
    res.status(201).json({ journal });
});
exports.getJournals = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const search = req.query.search || "";
    const query = {
        userId: req.user.userId,
        $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } }
        ]
    };
    const journals = await Journal_1.JournalModel.find(query).sort({ createdAt: -1 });
    res.json({ journals });
});
exports.updateJournal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const journal = await Journal_1.JournalModel.findOne({
        _id: req.params.id,
        userId: req.user.userId
    });
    if (!journal) {
        throw new ApiError_1.ApiError(404, "Journal not found");
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
        const ai = await (0, ai_service_1.analyzeEmotion)(req.body.content);
        journal.emotionalState = ai.emotionalState;
        journal.positivityScore = ai.positivityScore;
        journal.aiInsights = ai.suggestions;
    }
    await journal.save();
    res.json({ journal });
});
exports.deleteJournal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const deleted = await Journal_1.JournalModel.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.userId
    });
    if (!deleted) {
        throw new ApiError_1.ApiError(404, "Journal not found");
    }
    res.json({ message: "Journal deleted" });
});
