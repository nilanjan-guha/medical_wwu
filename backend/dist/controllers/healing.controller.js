"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHealingSession = exports.listHealingSessions = void 0;
const HealingSession_1 = require("../models/HealingSession");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.listHealingSessions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const sessions = await HealingSession_1.HealingSessionModel.find({ userId: req.user.userId })
        .sort({ createdAt: -1 })
        .limit(20);
    res.json({ sessions });
});
exports.createHealingSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const session = await HealingSession_1.HealingSessionModel.create({
        userId: req.user.userId,
        type: req.body.type,
        durationSeconds: req.body.durationSeconds,
        completed: req.body.completed ?? false,
        favorited: req.body.favorited ?? false
    });
    res.status(201).json({ session });
});
