type OrganizationStatsProps = {
  totalLeaders: number;
  totalSections: number;
  totalMembers: number;
};

const OrganizationStats = ({
  totalLeaders,
  totalSections,
  totalMembers,
}: OrganizationStatsProps) => (
  <section className="student-stats">
    <article className="student-stat-card">
      <span>Total Pengurus</span>
      <strong>{totalMembers}</strong>
      <p>Kepala, lurah, dan anggota bagian</p>
    </article>
    <article className="student-stat-card">
      <span>Total Lurah</span>
      <strong>{totalLeaders}</strong>
      <p>Baris pimpinan kedua</p>
    </article>
    <article className="student-stat-card">
      <span>Total Bagian</span>
      <strong>{totalSections}</strong>
      <p>Kelompok divisi organisasi</p>
    </article>
    <article className="student-stat-card">
      <span>Sinkronisasi</span>
      <strong>API</strong>
      <p>Ambil dan kirim data ke backend</p>
    </article>
  </section>
);

export default OrganizationStats;
