"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WellnessProgressModel = void 0;
const mongoose_1 = require("mongoose");
const wellnessProgressSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    streakDays: { type: Number, default: 0 },
    totalCheckins: { type: Number, default: 0 },
    totalJournalEntries: { type: Number, default: 0 },
    averagePositivity: { type: Number, default: 50, min: 0, max: 100 },
    lastActiveAt: { type: Date, default: Date.now }
}, { timestamps: true });
exports.WellnessProgressModel = (0, mongoose_1.model)("WellnessProgress", wellnessProgressSchema);
