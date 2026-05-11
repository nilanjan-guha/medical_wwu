"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyContactModel = void 0;
const mongoose_1 = require("mongoose");
const emergencyContactSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },
    type: {
        type: String,
        enum: ["caregiver", "hospital", "mental-support", "family"],
        required: true
    }
}, { timestamps: true });
exports.EmergencyContactModel = (0, mongoose_1.model)("EmergencyContact", emergencyContactSchema);
