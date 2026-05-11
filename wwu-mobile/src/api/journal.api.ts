import { Journal } from "../types";
import { api } from "./client";

export const journalApi = {
  list: async (search = "") => {
    const { data } = await api.get<{ journals: Journal[] }>("/journals", {
      params: { search }
    });
    return data.journals;
  },
  create: async (payload: { title: string; content: string; tags: string[] }) => {
    const { data } = await api.post<{ journal: Journal }>("/journals", payload);
    return data.journal;
  },
  remove: async (id: string) => {
    await api.delete(`/journals/${id}`);
  }
};
