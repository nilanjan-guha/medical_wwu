"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodLogModel = void 0;
const mongoose_1 = require("mongoose");
const moodLogSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    anxiety: { type: Number, required: true, min: 0, max: 10 },
    fear: { type: Number, required: true, min: 0, max: 10 },
    stress: { type: Number, required: true, min: 0, max: 10 },
    depression: { type: Number, required: true, min: 0, max: 10 },
    sleepQuality: { type: Number, required: true, min: 0, max: 10 },
    motivation: { type: Number, required: true, min: 0, max: 10 },
    painLevel: { type: Number, required: true, min: 0, max: 10 },
    emotionalState: { type: String, required: true, index: true },
    positivityScore: { type: Number, required: true, min: 0, max: 100 },
    aiSuggestions: [{ type: String }],
    rawInput: { type: String, required: true }
}, { timestamps: true });
moodLogSchema.index({ userId: 1, createdAt: -1 });
exports.MoodLogModel = (0, mongoose_1.model)("MoodLog", moodLogSchema);
