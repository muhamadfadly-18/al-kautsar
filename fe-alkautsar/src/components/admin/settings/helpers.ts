import type { AdminUserRecord } from "./types";

export const filterAdminUsers = (
  users: AdminUserRecord[],
  search: string,
): AdminUserRecord[] => {
  const keyword = search.trim().toLowerCase();

  if (!keyword) {
    return users;
  }

  return users.filter((user) =>
    [user.name, user.email, user.role, user.status].some((value) =>
      value.toLowerCase().includes(keyword),
    ),
  );
};

export const getAdminStats = (users: AdminUserRecord[]) => ({
  totalAdmins: users.length,
  totalActive: users.filter((user) => user.status === "active").length,
  totalSuperAdmins: users.filter((user) =>
    user.role.toLowerCase().includes("super"),
  ).length,
});
