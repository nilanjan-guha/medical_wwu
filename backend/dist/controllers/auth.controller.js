"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.resetPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.login = exports.signup = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const token_1 = require("../utils/token");
exports.signup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const exists = await User_1.UserModel.findOne({ email: req.body.email });
    if (exists) {
        throw new ApiError_1.ApiError(409, "Email already exists");
    }
    const user = await User_1.UserModel.create(req.body);
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = (0, token_1.signAccessToken)(payload);
    const refreshToken = (0, token_1.signRefreshToken)(payload);
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
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.UserModel.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
        throw new ApiError_1.ApiError(401, "Invalid credentials");
    }
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = (0, token_1.signAccessToken)(payload);
    const refreshToken = (0, token_1.signRefreshToken)(payload);
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
exports.refreshToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { refreshToken: token } = req.body;
    const payload = (0, token_1.verifyRefreshToken)(token);
    const user = await User_1.UserModel.findById(payload.userId);
    if (!user || !user.refreshTokens.includes(token)) {
        throw new ApiError_1.ApiError(401, "Invalid refresh token");
    }
    const newAccessToken = (0, token_1.signAccessToken)({
        userId: user.id,
        email: user.email,
        role: user.role
    });
    res.json({ accessToken: newAccessToken });
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { refreshToken: token } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
        throw new ApiError_1.ApiError(401, "Unauthorized");
    }
    const user = await User_1.UserModel.findById(userId);
    if (user && token) {
        user.refreshTokens = user.refreshTokens.filter((rt) => rt !== token);
        await user.save();
    }
    res.json({ message: "Logged out successfully" });
});
exports.forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.UserModel.findOne({ email: req.body.email });
    // Return success response regardless of user existence to avoid account enumeration.
    if (!user) {
        return res.json({ message: "If the email exists, reset instructions are sent." });
    }
    const tempToken = crypto_1.default.randomBytes(16).toString("hex");
    return res.json({
        message: "Password reset initiated. In production, send this via email service.",
        resetToken: tempToken
    });
});
exports.resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await User_1.UserModel.findOne({ email });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
});
exports.me = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.UserModel.findById(req.user?.userId).select("-password -refreshTokens");
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    res.json({ user });
});
