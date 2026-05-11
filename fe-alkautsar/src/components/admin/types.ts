import type { AuthUser } from "../../services/admin/auth";

export type AdminMenu =
  | "overview"
  | "content"
  | "organization"
  | "students"
  | "reports"
  | "settings";

export type StoredSession = {
  token: string;
  user?: AuthUser;
};
