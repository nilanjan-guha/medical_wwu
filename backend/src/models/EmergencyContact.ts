import { Document, Schema, Types, model } from "mongoose";

export interface IEmergencyContact extends Document {
  userId: Types.ObjectId;
  name: string;
  phone: string;
  relation: string;
  type: "caregiver" | "hospital" | "mental-support" | "family";
}

const emergencyContactSchema = new Schema<IEmergencyContact>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    relation: { type: String, trim: true, default: "" },
    type: {
      type: String,
      enum: ["caregiver", "hospital", "mental-support", "family"],
      default: "family"
    }
  },
  { timestamps: true }
);

export const EmergencyContactModel = model<IEmergencyContact>(
  "EmergencyContact",
  emergencyContactSchema
);
