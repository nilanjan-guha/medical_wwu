import { Document, Schema, Types, model } from "mongoose";

export interface IAIAnalysis extends Document {
  userId: Types.ObjectId;
  source: "journal" | "mood-checkin";
  rawText: string;
  emotionalState: string;
  positivityScore: number;
  suggestions: string[];
}

const aiAnalysisSchema = new Schema<IAIAnalysis>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    source: { type: String, enum: ["journal", "mood-checkin"], required: true },
    rawText: { type: String, required: true },
    emotionalState: { type: String, required: true },
    positivityScore: { type: Number, required: true, min: 0, max: 100 },
    suggestions: [{ type: String }]
  },
  { timestamps: true }
);

export const AIAnalysisModel = model<IAIAnalysis>("AIAnalysis", aiAnalysisSchema);
