import { Document, Schema, Types, model } from "mongoose";

export interface IWellnessProgress extends Document {
  userId: Types.ObjectId;
  streakDays: number;
  totalCheckins: number;
  totalJournalEntries: number;
  averagePositivity: number;
  lastActiveAt: Date;
}

const wellnessProgressSchema = new Schema<IWellnessProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    streakDays: { type: Number, default: 0 },
    totalCheckins: { type: Number, default: 0 },
    totalJournalEntries: { type: Number, default: 0 },
    averagePositivity: { type: Number, default: 50, min: 0, max: 100 },
    lastActiveAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const WellnessProgressModel = model<IWellnessProgress>(
  "WellnessProgress",
  wellnessProgressSchema
);
