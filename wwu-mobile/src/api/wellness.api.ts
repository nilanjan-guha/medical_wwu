import { api } from "./client";

export type WellnessProgress = {
  streakDays: number;
  totalCheckins: number;
  totalJournalEntries: number;
  averagePositivity: number;
  lastActiveAt: string;
};

export type EmergencyContact = {
  _id: string;
  name: string;
  phone: string;
  relationship: string;
};

export const wellnessApi = {
  getProgress: async () => {
    // WellnessProgress is auto-updated by mood/journal controllers.
    // We read it from the mood history and profile endpoints as a derived stat.
    const { data } = await api.get<{ progress: WellnessProgress }>("/wellness/progress");
    return data.progress;
  }
};

export const emergencyContactsApi = {
  list: async () => {
    const { data } = await api.get<{ contacts: EmergencyContact[] }>("/emergency/contacts");
    return data.contacts;
  },
  add: async (payload: { name: string; phone: string; relationship: string }) => {
    const { data } = await api.post<{ contact: EmergencyContact }>("/emergency/contacts", {
      ...payload,
      relation: payload.relationship,
      type: "family"
    });
    return data.contact;
  }
};
