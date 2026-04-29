import { api } from "./client";

export interface TextError {
  word: string;
  position: number;
  suggestion: string;
  reason: string;
}

export interface TextCheckResponse {
  original_text: string;
  corrected_text: string;
  errors: TextError[];
  score: number;
}

export const checkText = async (text: string) => {
  const res = await api.post<TextCheckResponse>("/text/check", { text });
  return res.data;
};
