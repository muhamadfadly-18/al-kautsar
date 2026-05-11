import { useEffect, useEffectEvent, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  getPpdbSummary,
  type PpdbRecord,
  type PpdbSummary,
} from "../../../services/admin/reports";

type PpdbReportsProps = {
  onUnreadChange?: (count: number) => void;
};

const REPORT_LAST_SEEN_KEY = "ppdb_reports_last_seen_at";

const getLatestSeenAt = (items: PpdbRecord[], fallback: string) => {
  const latestTimestamp = items.reduce((result, item) => {
    const value = item.createdAt ? new Date(item.createdAt).getTime() : 0;
    return Number.isFinite(value) ? Math.max(result, value) : result;
  }, new Date(fallback).getTime());

  return new Date(latestTimestamp).toISOString();
};

const formatDate = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatDay = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
  }).format(date);
};

const PpdbReports = ({ onUnreadChange }: PpdbReportsProps) => {
  const [items, setItems] = useState<PpdbRecord[]>([]);
  const [summary, setSummary] = useState<PpdbSummary>({
    total: 0,
    baru: 0,
    hariIni: 0,
    mingguIni: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hasOpenedReport, setHasOpenedReport] = useState(false);

  const loadData = async (seenAt?: string | null, forceRead = false) => {
    setLoading(true);

    try {
      const lastSeenAt =
        seenAt === undefined
          ? localStorage.getItem(REPORT_LAST_SEEN_KEY)
          : seenAt;
      const result = await getPpdbSummary(lastSeenAt);
      setItems(result.items);
      if (forceRead && lastSeenAt) {
        localStorage.setItem(
          REPORT_LAST_SEEN_KEY,
          getLatestSeenAt(result.items, lastSeenAt),
        );
      }
      setSummary({
        ...result.summary,
        baru: forceRead ? 0 : result.summary.baru,
      });
      onUnreadChange?.(forceRead ? 0 : result.summary.baru);
    } catch (error) {
      onUnreadChange?.(0);
      await Swal.fire({
        title: "Gagal memuat laporan PPDB",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data laporan PPDB.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "student-swal-confirm" },
        buttonsStyling: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const markCurrentReportsAsRead = useEffectEvent(async () => {
    setHasOpenedReport(true);
    setSummary((current) => ({
      ...current,
      baru: 0,
    }));
    const currentSeenAt = new Date().toISOString();
    localStorage.setItem(REPORT_LAST_SEEN_KEY, currentSeenAt);
    onUnreadChange?.(0);
    await loadData(currentSeenAt, true);
  });

  const handleRefresh = async () => {
    setHasOpenedReport(true);
    setSummary((current) => ({
      ...current,
      baru: 0,
    }));
    const currentSeenAt = new Date().toISOString();
    localStorage.setItem(REPORT_LAST_SEEN_KEY, currentSeenAt);
    onUnreadChange?.(0);
    await loadData(currentSeenAt, true);
  };

  const handleInitialLoad = useEffectEvent(() => {
    void markCurrentReportsAsRead();
  });

  useEffect(() => {
    handleInitialLoad();
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter((item) =>
      [
        item.registrationCode,
        item.namaSiswa,
        item.unitTujuan,
        item.namaOrangTua,
        item.nomorWhatsapp,
        item.email,
        item.alamat,
      ].some((value) => value.toLowerCase().includes(keyword)),
    );
  }, [items, search]);

  return (
    <section className="report-manager">
      <div className="report-manager__hero">
        <div>
          <div className="admin-badge">Laporan PPDB</div>
          <div className="report-heading">
            <h2>Laporan pendaftar PPDB</h2>
            {!hasOpenedReport && summary.baru > 0 ? (
              <span className="report-notice-badge">
                {summary.baru} baru
              </span>
            ) : null}
          </div>
         
        </div>

        <div className="student-toolbar">
          <button
            type="button"
            className="admin-button"
            onClick={() => void handleRefresh()}
            disabled={loading}
          >
            Refresh Data
          </button>
        </div>
      </div>

      <section className="student-stats">
        <article className="student-stat-card">
          <span>Total Pendaftar</span>
          <strong>{summary.total}</strong>
          <p>Semua data yang tersimpan</p>
        </article>
        <article className="student-stat-card">
          <span>Pendaftar Baru</span>
          <strong>{hasOpenedReport ? 0 : summary.baru}</strong>
          <p>Otomatis terbaca saat laporan dibuka</p>
        </article>
        <article className="student-stat-card">
          <span>Masuk Hari Ini</span>
          <strong>{summary.hariIni}</strong>
          <p>Pendaftaran tanggal hari ini</p>
        </article>
        <article className="student-stat-card">
          <span>7 Hari Terakhir</span>
          <strong>{summary.mingguIni}</strong>
          <p>Aktivitas pendaftaran terbaru</p>
        </article>
      </section>

      <article className="student-list-card">
        <div className="admin-card__header">
          <div>
            <span className="admin-card__eyebrow">Daftar PPDB</span>
            <h3>Data calon siswa masuk</h3>
          </div>
          <strong>{filteredItems.length} data</strong>
        </div>

        <div className="student-filters report-filters">
          <label className="content-field content-field--full">
            <span>Cari pendaftar</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama siswa, kode daftar, unit, wali, atau WhatsApp"
            />
          </label>
        </div>

        <div className="student-table-wrap mt-3">
          <table className="student-table report-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Siswa</th>
                <th>Unit</th>
                <th>Wali</th>
                <th>Kontak</th>
                <th>Tanggal Masuk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="student-table__empty">
                    Memuat laporan PPDB...
                  </td>
                </tr>
              ) : filteredItems.length ? (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.registrationCode || "-"}</td>
                    <td>
                      <strong>{item.namaSiswa || "-"}</strong>
                      <p>
                        {item.jenisKelamin || "-"} •{" "}
                        {formatDay(item.tanggalLahir)}
                      </p>
                    </td>
                    <td>
                      {item.unitTujuan || "-"}
                      <p>{item.asalSekolah || "Belum ada asal sekolah"}</p>
                    </td>
                    <td>
                      {item.namaOrangTua || "-"}
                      <p>{item.alamat || "-"}</p>
                    </td>
                    <td>
                      {item.nomorWhatsapp || "-"}
                      <p>{item.email || "Tanpa email"}</p>
                    </td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                      <span className="report-status-pill">
                        {item.status || "Baru"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="student-table__empty">
                    Belum ada data PPDB yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>

      
    </section>
  );
};

export default PpdbReports;
