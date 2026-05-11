"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalModel = void 0;
const mongoose_1 = require("mongoose");
const journalSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    tags: [{ type: String }],
    emotionalState: { type: String, required: true, default: "Unknown" },
    positivityScore: { type: Number, required: true, default: 50, min: 0, max: 100 },
    aiInsights: [{ type: String }]
}, { timestamps: true });
journalSchema.index({ userId: 1, createdAt: -1 });
exports.JournalModel = (0, mongoose_1.model)("Journal", journalSchema);
