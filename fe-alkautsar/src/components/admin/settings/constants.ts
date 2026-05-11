import type { AdminUserFormState } from "./types";

export const createEmptyAdminUserForm = (): AdminUserFormState => ({
  name: "",
  email: "",
  password: "",
  role: "admin",
  status: "active",
});

export const adminRoleOptions = ["admin", "super_admin", "editor"];
export const adminStatusOptions = ["active", "inactive"];
