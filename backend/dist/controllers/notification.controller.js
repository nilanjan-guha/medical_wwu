"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertNotificationPreference = exports.listNotificationPreferences = void 0;
const Notification_1 = require("../models/Notification");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.listNotificationPreferences = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const notifications = await Notification_1.NotificationModel.find({ userId: req.user.userId });
    res.json({ notifications });
});
exports.upsertNotificationPreference = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const notification = await Notification_1.NotificationModel.findOneAndUpdate({
        userId: req.user.userId,
        type: req.body.type
    }, {
        title: req.body.title,
        body: req.body.body,
        scheduleTime: req.body.scheduleTime,
        enabled: req.body.enabled
    }, { upsert: true, new: true });
    res.json({ notification });
});
