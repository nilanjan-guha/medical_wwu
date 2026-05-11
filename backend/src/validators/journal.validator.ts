import { z } from "zod";

export const createJournalSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(5),
  tags: z.array(z.string()).default([])
});

export const updateJournalSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(5).optional(),
  tags: z.array(z.string()).optional()
});
