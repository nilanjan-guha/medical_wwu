import { Router } from "express";
import {
  createJournal,
  deleteJournal,
  getJournals,
  updateJournal
} from "../controllers/journal.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { createJournalSchema, updateJournalSchema } from "../validators/journal.validator";

export const journalRouter = Router();

journalRouter.use(requireAuth);
journalRouter.post("/", validateBody(createJournalSchema), createJournal);
journalRouter.get("/", getJournals);
journalRouter.patch("/:id", validateBody(updateJournalSchema), updateJournal);
journalRouter.delete("/:id", deleteJournal);
