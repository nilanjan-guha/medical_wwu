import { Document, Schema, Types, model } from "mongoose";

export interface IHealingSession extends Document {
  userId: Types.ObjectId;
  type: "breathing" | "meditation" | "music" | "sleep" | "video";
  durationSeconds: number;
  completed: boolean;
  favorited: boolean;
}

const healingSessionSchema = new Schema<IHealingSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["breathing", "meditation", "music", "sleep", "video"],
      required: true
    },
    durationSeconds: { type: Number, required: true, min: 0 },
    completed: { type: Boolean, default: false },
    favorited: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const HealingSessionModel = model<IHealingSession>(
  "HealingSession",
  healingSessionSchema
);
