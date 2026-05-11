import { Request, Response } from "express";
import { NotificationModel } from "../models/Notification";
import { asyncHandler } from "../utils/asyncHandler";

export const listNotificationPreferences = asyncHandler(
  async (req: Request, res: Response) => {
    const notifications = await NotificationModel.find({ userId: req.user!.userId });
    res.json({ notifications });
  }
);

export const upsertNotificationPreference = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await NotificationModel.findOneAndUpdate(
      {
        userId: req.user!.userId,
        type: req.body.type
      },
      {
        title: req.body.title,
        body: req.body.body,
        scheduleTime: req.body.scheduleTime,
        enabled: req.body.enabled
      },
      { upsert: true, new: true }
    );

    res.json({ notification });
  }
);
