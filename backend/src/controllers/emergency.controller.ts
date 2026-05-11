import { Request, Response } from "express";
import { EmergencyContactModel } from "../models/EmergencyContact";
import { asyncHandler } from "../utils/asyncHandler";

export const getEmergencyContacts = asyncHandler(async (req: Request, res: Response) => {
  const contacts = await EmergencyContactModel.find({ userId: req.user!.userId });
  res.json({
    contacts: contacts.map((contact) => ({
      _id: contact._id,
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relation ?? "",
      type: contact.type
    }))
  });
});

export const addEmergencyContact = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as {
    name?: string;
    phone?: string;
    relation?: string;
    relationship?: string;
    type?: "caregiver" | "hospital" | "mental-support" | "family";
  };

  const relation = (body.relationship ?? body.relation ?? "").trim();
  const type = body.type ?? "family";

  const contact = await EmergencyContactModel.create({
    userId: req.user!.userId,
    name: body.name,
    phone: body.phone,
    relation,
    type
  });
  res.status(201).json({
    contact: {
      _id: contact._id,
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relation ?? "",
      type: contact.type
    }
  });
});
