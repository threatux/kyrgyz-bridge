import { api } from "./client";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const res = await api.post<RegisterResponse>("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: LoginPayload) => {
  const res = await api.post<LoginResponse>("/auth/login", data);
  return res.data;
};
