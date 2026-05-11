import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
};

export type LoginResult = {
  token: string;
  user?: AuthUser;
  raw: unknown;
};

const pickToken = (data: Record<string, unknown>): string | undefined => {
  if (typeof data.token === "string") return data.token;
  if (typeof data.accessToken === "string") return data.accessToken;
  if (typeof data.access_token === "string") return data.access_token;

  const nestedData = data.data;
  if (nestedData && typeof nestedData === "object") {
    return pickToken(nestedData as Record<string, unknown>);
  }

  return undefined;
};

const pickUser = (data: Record<string, unknown>): AuthUser | undefined => {
  const directUser = data.user;
  if (directUser && typeof directUser === "object") {
    return directUser as AuthUser;
  }

  const nestedData = data.data;
  if (nestedData && typeof nestedData === "object") {
    return pickUser(nestedData as Record<string, unknown>);
  }

  const fallbackUser = data.admin;
  if (fallbackUser && typeof fallbackUser === "object") {
    return fallbackUser as AuthUser;
  }

  return undefined;
};

export const loginAdmin = async (
  payload: LoginPayload,
): Promise<LoginResult> => {
  const response = await api.post("/api/auth/login", payload);
  const data = response.data as Record<string, unknown>;
  const token = pickToken(data);

  if (!token) {
    throw new Error("Token login tidak ditemukan dari respons API.");
  }

  return {
    token,
    user: pickUser(data),
    raw: response.data,
  };
};
