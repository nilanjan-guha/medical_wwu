import { User } from "../types";
import { api } from "./client";

export const profileApi = {
  get: async () => {
    const { data } = await api.get<{ user: User }>("/profile");
    return data.user;
  },
  update: async (payload: Partial<Pick<User, "name" | "healthConditions" | "consentForEmotionAnalysis">>) => {
    const { data } = await api.patch<{ user: User }>("/profile", payload);
    return data.user;
  },
  deleteAccount: async () => {
    await api.delete("/profile");
  }
};
