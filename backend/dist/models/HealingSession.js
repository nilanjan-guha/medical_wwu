"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealingSessionModel = void 0;
const mongoose_1 = require("mongoose");
const healingSessionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
        type: String,
        enum: ["breathing", "meditation", "music", "sleep", "video"],
        required: true
    },
    durationSeconds: { type: Number, required: true, min: 0 },
    completed: { type: Boolean, default: false },
    favorited: { type: Boolean, default: false }
}, { timestamps: true });
exports.HealingSessionModel = (0, mongoose_1.model)("HealingSession", healingSessionSchema);
