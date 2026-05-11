import OpenAI from "openai";
import { env } from "../config/env";

export interface AnalysisResult {
  emotionalState:
    | "Anxiety"
    | "Stress"
    | "Depression"
    | "Positive"
    | "Hopeful"
    | "Lonely"
    | "Fearful";
  positivityScore: number;
  suggestions: string[];
}

const fallbackAnalysis = (text: string): AnalysisResult => {
  const lower = text.toLowerCase();

  if (lower.includes("anx") || lower.includes("panic")) {
    return {
      emotionalState: "Anxiety",
      positivityScore: 35,
      suggestions: [
        "Try 4-7-8 breathing for 5 minutes.",
        "Listen to a calm instrumental track for 10 minutes.",
        "Write one supportive sentence to yourself."
      ]
    };
  }

  if (lower.includes("fear") || lower.includes("afraid")) {
    return {
      emotionalState: "Fearful",
      positivityScore: 40,
      suggestions: [
        "Ground yourself with five things you can see right now.",
        "Take three rounds of slow deep breaths.",
        "Reach out to a trusted caregiver contact."
      ]
    };
  }

  if (lower.includes("alone") || lower.includes("lonely")) {
    return {
      emotionalState: "Lonely",
      positivityScore: 45,
      suggestions: [
        "Send a short message to someone in your support circle.",
        "Play a guided connection meditation.",
        "Journal one thing you want help with today."
      ]
    };
  }

  return {
    emotionalState: "Hopeful",
    positivityScore: 70,
    suggestions: [
      "Continue your breathing routine for 3 minutes.",
      "Keep a short gratitude journal entry.",
      "Play your favorite calming song."
    ]
  };
};

const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export const analyzeEmotion = async (inputText: string): Promise<AnalysisResult> => {
  if (!client) {
    return fallbackAnalysis(inputText);
  }

  const response = await client.responses.create({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content:
          "You are an emotional wellness classifier. Respond ONLY JSON with fields: emotionalState, positivityScore, suggestions. emotionalState must be one of Anxiety, Stress, Depression, Positive, Hopeful, Lonely, Fearful. positivityScore is integer 0-100. suggestions is array of 3 short healing suggestions."
      },
      {
        role: "user",
        content: inputText
      }
    ]
  });

  const content = response.output_text;

  try {
    const parsed = JSON.parse(content) as AnalysisResult;
    return {
      emotionalState: parsed.emotionalState,
      positivityScore: Math.min(100, Math.max(0, Math.round(parsed.positivityScore))),
      suggestions: parsed.suggestions?.slice(0, 3) ?? []
    };
  } catch {
    return fallbackAnalysis(inputText);
  }
};
