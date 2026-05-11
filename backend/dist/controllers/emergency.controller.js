"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEmergencyContact = exports.getEmergencyContacts = void 0;
const EmergencyContact_1 = require("../models/EmergencyContact");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getEmergencyContacts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const contacts = await EmergencyContact_1.EmergencyContactModel.find({ userId: req.user.userId });
    res.json({ contacts });
});
exports.addEmergencyContact = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const contact = await EmergencyContact_1.EmergencyContactModel.create({
        userId: req.user.userId,
        ...req.body
    });
    res.status(201).json({ contact });
});
