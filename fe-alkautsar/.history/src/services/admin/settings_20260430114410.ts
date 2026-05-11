import { AxiosError } from "axios";
import type {
  AdminUserFormState,
  AdminUserRecord,
} from "../../components/admin/settings/types";
import { api, isRecord, pickString, unwrapData } from "../shared/client";

const configuredEndpoint = import.meta.env.VITE_ADMIN_USERS_ENDPOINT?.trim();

const adminUserEndpoints = configuredEndpoint
  ? [configuredEndpoint]
  : ["/api/admin/users", "/api/users/admin", "/api/users", "/api/admins"];

const shouldTryAnotherEndpoint = (error: unknown) =>
  error instanceof AxiosError &&
  [404, 405].includes(error.response?.status ?? 0);

const requestWithFallback = async <T>(
  handler: (endpoint: string) => Promise<T>,
): Promise<T> => {
  let lastError: unknown;

  for (const endpoint of adminUserEndpoints) {
    try {
      return await handler(endpoint);
    } catch (error) {
      lastError = error;

      if (!shouldTryAnotherEndpoint(error)) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error("Endpoint user admin tidak ditemukan.");
};

const pickCollection = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  const candidates = [payload.items, payload.users, payload.admins, payload.data];
  const matched = candidates.find(Array.isArray);

  return Array.isArray(matched) ? matched : [];
};

const normalizeAdminUser = (value: unknown, index: number): AdminUserRecord => {
  const raw = isRecord(value) ? value : {};

  return {
    id: pickString(raw.id ?? raw._id ?? raw.uuid ?? `admin-${index + 1}`),
    name: pickString(raw.name ?? raw.fullName ?? raw.username, "Admin"),
    email: pickString(raw.email),
    role: pickString(raw.role, "admin"),
    status: pickString(raw.status, "active"),
    createdAt: pickString(raw.createdAt ?? raw.created_at),
    updatedAt: pickString(raw.updatedAt ?? raw.updated_at),
  };
};

const toAdminUserPayload = (payload: AdminUserFormState, includePassword: boolean) => {
  const nextPayload: Record<string, unknown> = {
    name: payload.name,
    email: payload.email,
    role: payload.role,
    status: payload.status,
  };

  if (includePassword && payload.password.trim()) {
    nextPayload.password = payload.password.trim();
  }

  return nextPayload;
};

export const getAdminUsers = async (): Promise<AdminUserRecord[]> =>
  requestWithFallback(async (endpoint) => {
    const response = await api.get(endpoint);
    const payload = unwrapData<unknown>(response.data);

    return pickCollection(payload).map(normalizeAdminUser);
  });

export const createAdminUser = async (
  payload: AdminUserFormState,
): Promise<AdminUserRecord> =>
  requestWithFallback(async (endpoint) => {
    const response = await api.post(
      endpoint,
      toAdminUserPayload(payload, true),
    );

    return normalizeAdminUser(unwrapData<unknown>(response.data), 0);
  });

export const updateAdminUser = async (
  id: string,
  payload: AdminUserFormState,
): Promise<AdminUserRecord> =>
  requestWithFallback(async (endpoint) => {
    const response = await api.put(
      `${endpoint}/${id}`,
      toAdminUserPayload(payload, false),
    );

    return normalizeAdminUser(unwrapData<unknown>(response.data), 0);
  });

export const deleteAdminUser = async (id: string): Promise<void> =>
  requestWithFallback(async (endpoint) => {
    await api.delete(`${endpoint}/${id}`);
  });
