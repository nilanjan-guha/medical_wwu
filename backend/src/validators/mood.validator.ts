import { z } from "zod";

export const moodCheckinSchema = z.object({
  anxiety: z.number().min(0).max(10),
  fear: z.number().min(0).max(10),
  stress: z.number().min(0).max(10),
  depression: z.number().min(0).max(10),
  sleepQuality: z.number().min(0).max(10),
  motivation: z.number().min(0).max(10),
  painLevel: z.number().min(0).max(10),
  freeText: z.string().default("")
});
