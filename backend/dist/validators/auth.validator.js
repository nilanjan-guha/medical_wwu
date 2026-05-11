"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    healthConditions: zod_1.z.array(zod_1.z.string()).default([]),
    consentForEmotionAnalysis: zod_1.z.boolean().default(false)
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8)
});
exports.refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10)
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    newPassword: zod_1.z.string().min(8)
});
