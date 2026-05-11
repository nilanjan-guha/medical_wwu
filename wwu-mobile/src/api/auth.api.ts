import { api } from "./client";
import { AuthResponse, User } from "../types";

export const authApi = {
  signup: async (payload: {
    name: string;
    email: string;
    password: string;
    healthConditions: string[];
    consentForEmotionAnalysis: boolean;
  }) => {
    const { data } = await api.post<AuthResponse>("/auth/signup", payload);
    return data;
  },
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },
  forgotPassword: async (email: string) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },
  me: async () => {
    const { data } = await api.get<{ user: User }>("/auth/me");
    return data.user;
  }
};
