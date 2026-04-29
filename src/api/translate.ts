import { api } from "./client";

export type TranslateDirection = "ky-ru" | "ru-ky";

export interface TranslateResponse {
  source_text: string;
  translated_text: string;
  direction: TranslateDirection;
}

export const translateText = async (text: string, direction: TranslateDirection) => {
  const res = await api.post<TranslateResponse>("/translate", { text, direction });
  return res.data;
};
