"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.UserModel.findById(req.user.userId).select("-password -refreshTokens");
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    res.json({ user });
});
exports.updateProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.UserModel.findById(req.user.userId);
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    user.name = req.body.name ?? user.name;
    user.healthConditions = req.body.healthConditions ?? user.healthConditions;
    user.consentForEmotionAnalysis =
        req.body.consentForEmotionAnalysis ?? user.consentForEmotionAnalysis;
    await user.save();
    res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            healthConditions: user.healthConditions,
            consentForEmotionAnalysis: user.consentForEmotionAnalysis
        }
    });
});
