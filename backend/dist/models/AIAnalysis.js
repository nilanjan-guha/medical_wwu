"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAnalysisModel = void 0;
const mongoose_1 = require("mongoose");
const aiAnalysisSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    source: { type: String, enum: ["journal", "mood-checkin"], required: true },
    rawText: { type: String, required: true },
    emotionalState: { type: String, required: true },
    positivityScore: { type: Number, required: true, min: 0, max: 100 },
    suggestions: [{ type: String }]
}, { timestamps: true });
exports.AIAnalysisModel = (0, mongoose_1.model)("AIAnalysis", aiAnalysisSchema);
