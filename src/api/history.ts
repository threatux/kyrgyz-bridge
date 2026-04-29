import { api } from "./client";

export interface HistoryItem {
  id: number;
  action_type: string;
  request_data: string;
  response_data: string;
  created_at: string;
}

export const getHistory = async () => {
  const res = await api.get<HistoryItem[]>("/history");
  return res.data;
};
