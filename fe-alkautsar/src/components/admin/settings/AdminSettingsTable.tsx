import type { AdminUserRecord } from "./types";

type AdminSettingsTableProps = {
  users: AdminUserRecord[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onEdit: (user: AdminUserRecord) => void;
  onDelete: (user: AdminUserRecord) => void;
};

const AdminSettingsTable = ({
  users,
  loading,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}: AdminSettingsTableProps) => (
  <article className="student-list-card">
    <div className="admin-card__header">
      <div>
        <span className="admin-card__eyebrow">Daftar</span>
        <h3>User admin terdaftar</h3>
      </div>
      <strong>{users.length} admin</strong>
    </div>

    <div className="student-filters settings-filters">
      <label className="content-field content-field--full">
        <span>Cari admin</span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama, email, role, atau status"
        />
      </label>
    </div>

    <div className="student-table-wrap">
      <table className="student-table settings-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Update Terakhir</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="student-table__empty">
                Memuat data admin...
              </td>
            </tr>
          ) : users.length ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>{user.name || "-"}</strong>
                </td>
                <td>{user.email || "-"}</td>
                <td>{user.role || "-"}</td>
                <td>
                  <span className="settings-status-pill">{user.status || "-"}</span>
                </td>
                <td>{user.updatedAt || user.createdAt || "-"}</td>
                <td>
                  <div className="student-table__actions">
                    <button
                      type="button"
                      className="content-tabs__item"
                      onClick={() => onEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="content-item-card__delete"
                      onClick={() => onDelete(user)}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="student-table__empty">
                Belum ada data admin yang cocok.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </article>
);

export default AdminSettingsTable;
