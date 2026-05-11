export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  healthConditions: string[];
  consentForEmotionAnalysis: boolean;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type MoodCheckinPayload = {
  anxiety: number;
  fear: number;
  stress: number;
  depression: number;
  sleepQuality: number;
  motivation: number;
  painLevel: number;
  freeText: string;
};

export type MoodLog = {
  _id: string;
  emotionalState: string;
  positivityScore: number;
  aiSuggestions: string[];
  createdAt: string;
};

export type Journal = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  emotionalState: string;
  positivityScore: number;
  aiInsights: string[];
  createdAt: string;
};
