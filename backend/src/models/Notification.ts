import { Document, Schema, Types, model } from "mongoose";

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: "daily-mood" | "medication" | "hydration" | "meditation" | "motivation";
  title: string;
  body: string;
  scheduleTime: string;
  enabled: boolean;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["daily-mood", "medication", "hydration", "meditation", "motivation"],
      required: true
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    scheduleTime: { type: String, required: true },
    enabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const NotificationModel = model<INotification>("Notification", notificationSchema);
