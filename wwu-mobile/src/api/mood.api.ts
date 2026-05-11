import { MoodCheckinPayload, MoodLog } from "../types";
import { api } from "./client";

export const moodApi = {
  submitCheckin: async (payload: MoodCheckinPayload) => {
    const { data } = await api.post("/mood/checkin", payload);
    return data;
  },
  history: async () => {
    const { data } = await api.get<{ moods: MoodLog[] }>("/mood/history");
    return data.moods;
  }
};
