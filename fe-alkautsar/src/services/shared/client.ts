import axios from "axios";

const configuredBaseUrl =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";

const resolveApiBaseUrl = () => {
  // Saat development, pakai relative URL agar request lewat proxy Vite
  // dan tidak kena blokir CORS dari browser.
  if (import.meta.env.DEV && /^https?:\/\//i.test(configuredBaseUrl)) {
    return "";
  }

  return configuredBaseUrl || "http://localhost:3000";
};

export const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const unwrapData = <T>(payload: unknown): T => {
  if (isRecord(payload) && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
};

export const pickString = (value: unknown, fallback = "") =>
  String(value ?? fallback).trim();

export const getNestedRecord = (
  source: Record<string, unknown>,
  key: string,
): Record<string, unknown> | null => {
  const value = source[key];
  return isRecord(value) ? value : null;
};
