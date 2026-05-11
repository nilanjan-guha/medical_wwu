import { Document, Schema, Types, model } from "mongoose";

export interface IJournal extends Document {
  userId: Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  emotionalState: string;
  positivityScore: number;
  aiInsights: string[];
}

const journalSchema = new Schema<IJournal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    tags: [{ type: String }],
    emotionalState: { type: String, required: true, default: "Unknown" },
    positivityScore: { type: Number, required: true, default: 50, min: 0, max: 100 },
    aiInsights: [{ type: String }]
  },
  { timestamps: true }
);

journalSchema.index({ userId: 1, createdAt: -1 });

export const JournalModel = model<IJournal>("Journal", journalSchema);
