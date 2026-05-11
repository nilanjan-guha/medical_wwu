"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    healthConditions: [{ type: String }],
    consentForEmotionAnalysis: { type: Boolean, default: false },
    refreshTokens: [{ type: String }]
}, { timestamps: true });
userSchema.pre("save", async function hashPassword() {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcryptjs_1.default.hash(this.password, 12);
});
userSchema.methods.comparePassword = async function comparePassword(candidate) {
    return bcryptjs_1.default.compare(candidate, this.password);
};
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
