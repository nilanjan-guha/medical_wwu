import { api } from "./client";

export type HealingSession = {
  _id: string;
  type: string;
  durationSeconds: number;
  completed: boolean;
  favorited: boolean;
  createdAt: string;
};

export const healingApi = {
  listSessions: async () => {
    const { data } = await api.get<{ sessions: HealingSession[] }>("/healing/sessions");
    return data.sessions;
  },
  createSession: async (payload: {
    type: string;
    durationSeconds: number;
    completed?: boolean;
    favorited?: boolean;
  }) => {
    const { data } = await api.post<{ session: HealingSession }>("/healing/sessions", payload);
    return data.session;
  }
};
