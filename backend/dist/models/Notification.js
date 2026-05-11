"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
        type: String,
        enum: ["daily-mood", "medication", "hydration", "meditation", "motivation"],
        required: true
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    scheduleTime: { type: String, required: true },
    enabled: { type: Boolean, default: true }
}, { timestamps: true });
exports.NotificationModel = (0, mongoose_1.model)("Notification", notificationSchema);
