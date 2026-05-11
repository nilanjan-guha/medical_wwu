import { Router } from "express";
import {
  addEmergencyContact,
  getEmergencyContacts
} from "../controllers/emergency.controller";
import { requireAuth } from "../middleware/auth.middleware";

export const emergencyRouter = Router();

emergencyRouter.use(requireAuth);
emergencyRouter.get("/contacts", getEmergencyContacts);
emergencyRouter.post("/contacts", addEmergencyContact);
