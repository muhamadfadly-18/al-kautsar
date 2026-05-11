export const monthlyVisitors = [62, 78, 74, 96, 88, 118, 126];
export const monthlyLabels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"];

export const chartPath = monthlyVisitors
  .map((value, index) => {
    const x = 30 + index * 75;
    const y = 180 - ((value - 50) / 80) * 120;
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  })
  .join(" ");

export const adminMetrics = [
  {
    label: "Total Siswa",
    value: "1.284",
    trend: "+12%",
    detail: "Naik dari bulan lalu",
  },
  {
    label: "Pendaftaran Baru",
    value: "86",
    trend: "+8%",
    detail: "Target tercapai 72%",
  },
  {
    label: "Konten Aktif",
    value: "48",
    trend: "+5 item",
    detail: "Berita, galeri, dan agenda",
  },
  {
    label: "Pesan Masuk",
    value: "19",
    trend: "Perlu ditinjau",
    detail: "6 pesan prioritas tinggi",
  },
];

export const quickActions = [
  "Kelola berita sekolah",
  "Review formulir pendaftaran",
  "Update agenda kegiatan",
  "Lihat laporan pengunjung",
];

export const recentActivities = [
  {
    title: "Artikel prestasi siswa dipublikasikan",
    time: "10 menit lalu",
    status: "Published",
  },
  {
    title: "3 formulir PPDB baru masuk",
    time: "25 menit lalu",
    status: "New",
  },
  {
    title: "Jadwal kegiatan Ramadhan diperbarui",
    time: "1 jam lalu",
    status: "Updated",
  },
  {
    title: "Permintaan edit profil guru menunggu persetujuan",
    time: "2 jam lalu",
    status: "Pending",
  },
];

export const scheduleItems = [
  { title: "Briefing admin", meta: "08.00 - Ruang TU" },
  { title: "Verifikasi data PPDB", meta: "10.00 - Dashboard" },
  { title: "Posting agenda Jumat", meta: "13.00 - Website" },
];
