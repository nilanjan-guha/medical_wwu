import { Document, Schema, Types, model } from "mongoose";

export interface IMoodLog extends Document {
  userId: Types.ObjectId;
  anxiety: number;
  fear: number;
  stress: number;
  depression: number;
  sleepQuality: number;
  motivation: number;
  painLevel: number;
  emotionalState: string;
  positivityScore: number;
  aiSuggestions: string[];
  rawInput: string;
}

const moodLogSchema = new Schema<IMoodLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    anxiety: { type: Number, required: true, min: 0, max: 10 },
    fear: { type: Number, required: true, min: 0, max: 10 },
    stress: { type: Number, required: true, min: 0, max: 10 },
    depression: { type: Number, required: true, min: 0, max: 10 },
    sleepQuality: { type: Number, required: true, min: 0, max: 10 },
    motivation: { type: Number, required: true, min: 0, max: 10 },
    painLevel: { type: Number, required: true, min: 0, max: 10 },
    emotionalState: { type: String, required: true, index: true },
    positivityScore: { type: Number, required: true, min: 0, max: 100 },
    aiSuggestions: [{ type: String }],
    rawInput: { type: String, required: true }
  },
  { timestamps: true }
);

moodLogSchema.index({ userId: 1, createdAt: -1 });

export const MoodLogModel = model<IMoodLog>("MoodLog", moodLogSchema);
