type AdminSettingsStatsProps = {
  totalAdmins: number;
  totalActive: number;
  totalSuperAdmins: number;
  isEditing: boolean;
};

const AdminSettingsStats = ({
  totalAdmins,
  totalActive,
  totalSuperAdmins,
  isEditing,
}: AdminSettingsStatsProps) => (
  <section className="student-stats">
    <article className="student-stat-card">
      <span>Total Admin</span>
      <strong>{totalAdmins}</strong>
      <p>Semua akun yang terdaftar</p>
    </article>
    <article className="student-stat-card">
      <span>Admin Aktif</span>
      <strong>{totalActive}</strong>
      <p>Akun dengan status active</p>
    </article>
    <article className="student-stat-card">
      <span>Super Admin</span>
      <strong>{totalSuperAdmins}</strong>
      <p>Akun dengan role super admin</p>
    </article>
    <article className="student-stat-card">
      <span>Mode Form</span>
      <strong>{isEditing ? "Edit" : "Tambah"}</strong>
      <p>{isEditing ? "Sedang mengubah akun admin" : "Siap menambah akun baru"}</p>
    </article>
  </section>
);

export default AdminSettingsStats;
