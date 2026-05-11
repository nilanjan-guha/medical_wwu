import crypto from "crypto";
import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/token";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const exists = await UserModel.findOne({ email: req.body.email });
  if (exists) {
    throw new ApiError(409, "Email already exists");
  }

  const user = await UserModel.create(req.body);

  const payload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshTokens.push(refreshToken);
  await user.save();

  res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      healthConditions: user.healthConditions,
      consentForEmotionAnalysis: user.consentForEmotionAnalysis
    },
    accessToken,
    refreshToken
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if (!(await user.comparePassword(req.body.password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const payload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshTokens.push(refreshToken);
  await user.save();

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      healthConditions: user.healthConditions,
      consentForEmotionAnalysis: user.consentForEmotionAnalysis
    },
    accessToken,
    refreshToken
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body as { refreshToken: string };
  const payload = verifyRefreshToken(token);

  const user = await UserModel.findById(payload.userId);
  if (!user || !user.refreshTokens.includes(token)) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const newAccessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  res.json({ accessToken: newAccessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body as { refreshToken: string };
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await UserModel.findById(userId);
  if (user && token) {
    user.refreshTokens = user.refreshTokens.filter((rt) => rt !== token);
    await user.save();
  }

  res.json({ message: "Logged out successfully" });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findOne({ email: req.body.email });

  // Return success regardless of user existence to avoid account enumeration.
  if (!user) {
    return res.json({ message: "If the email exists, reset instructions have been sent." });
  }

  const tempToken = crypto.randomBytes(32).toString("hex");
  const resetLink = `${process.env.FRONTEND_URL || "http://localhost:8081"}/(auth)/reset-password?token=${tempToken}&email=${encodeURIComponent(user.email)}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"We Are With U" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "WWU — Reset Your Password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#F2F7F5;border-radius:12px">
          <h2 style="color:#0C8A7B">We Are With U 💚</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your password. Click the link below to continue:</p>
          <a href="${resetLink}" style="display:inline-block;background:#0C8A7B;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Reset Password</a>
          <p style="color:#6B7280;font-size:13px;margin-top:24px">If you did not request this, you can safely ignore this email. This link expires in 1 hour.</p>
        </div>
      `
    });
  } catch (emailErr) {
    console.error("[ForgotPassword] Email send failed:", emailErr);
    // Still return success — do not leak SMTP errors to client
  }

  return res.json({ message: "If the email exists, reset instructions have been sent." });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, newPassword } = req.body as { email: string; newPassword: string };

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user?.userId).select("-password -refreshTokens");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({ user });
});
