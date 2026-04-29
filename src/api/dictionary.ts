import { api } from "./client";

export interface DictionaryResponse {
  word: string;
  translation: string;
  transcription: string;
  example: string;
}

export const searchDictionary = async (word: string) => {
  const res = await api.get<DictionaryResponse>("/dictionary/search", {
    params: { word },
  });
  return res.data;
};
