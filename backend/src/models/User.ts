import bcrypt from "bcryptjs";
import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  healthConditions: string[];
  consentForEmotionAnalysis: boolean;
  refreshTokens: string[];
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    healthConditions: [{ type: String }],
    consentForEmotionAnalysis: { type: Boolean, default: false },
    refreshTokens: [{ type: String }]
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const UserModel = model<IUser>("User", userSchema);
