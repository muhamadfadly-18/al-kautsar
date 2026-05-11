import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AxiosError } from "axios";
import { loginAdmin, setAuthToken, type AuthUser } from "../services/api";
import ContentManager from "../components/admin/content";
import "../styles/admin.css";

const AUTH_STORAGE_KEY = "admin_auth_session";
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;
const SESSION_EXPIRED_MESSAGE = "Session habis karena tidak ada aktivitas selama 5 menit. Silakan login lagi.";

type StoredSession = {
  token: string;
  user?: AuthUser;
};

const monthlyVisitors = [62, 78, 74, 96, 88, 118, 126];
const monthlyLabels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"];

const chartPath = monthlyVisitors
  .map((value, index) => {
    const x = 30 + index * 75;
    const y = 180 - ((value - 50) / 80) * 120;
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  })
  .join(" ");

const adminMetrics = [
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

const quickActions = [
  "Kelola berita sekolah",
  "Review formulir pendaftaran",
  "Update agenda kegiatan",
  "Lihat laporan pengunjung",
];

const recentActivities = [
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

const scheduleItems = [
  { title: "Briefing admin", meta: "08.00 - Ruang TU" },
  { title: "Verifikasi data PPDB", meta: "10.00 - Dashboard" },
  { title: "Posting agenda Jumat", meta: "13.00 - Website" },
];

const readStoredSession = (): StoredSession | null => {
  const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!savedSession) return null;

  try {
    return JSON.parse(savedSession) as StoredSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

const AdminPage = () => {
  const [activeMenu, setActiveMenu] = useState<
    "overview" | "content" | "students" | "reports" | "settings"
  >("overview");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");
  const [session, setSession] = useState<StoredSession | null>(null);
  const idleTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const savedSession = readStoredSession();
    setSession(savedSession);
    setAuthToken(savedSession?.token);
  }, []);

  const clearIdleTimeout = () => {
    if (idleTimeoutRef.current) {
      window.clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
  };

  const handleLogout = (message = "") => {
    clearIdleTimeout();
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthToken();
    setSession(null);
    setEmail("");
    setPassword("");
    setErrorMessage("");
    setSessionMessage(message);
  };

  useEffect(() => {
    if (!session?.token) {
      clearIdleTimeout();
      return;
    }

    const resetIdleTimer = () => {
      clearIdleTimeout();
      idleTimeoutRef.current = window.setTimeout(() => {
        handleLogout(SESSION_EXPIRED_MESSAGE);
      }, IDLE_TIMEOUT_MS);
    };

    const events: Array<keyof WindowEventMap> = [
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart",
    ];

    events.forEach((eventName) => {
      window.addEventListener(eventName, resetIdleTimer, { passive: true });
    });

    resetIdleTimer();

    return () => {
      clearIdleTimeout();
      events.forEach((eventName) => {
        window.removeEventListener(eventName, resetIdleTimer);
      });
    };
  }, [session?.token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSessionMessage("");

    try {
      const result = await loginAdmin({ email, password });
      const nextSession: StoredSession = {
        token: result.token,
        user: result.user,
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
      setAuthToken(result.token);
      setSession(nextSession);
      setActiveMenu("overview");
      setPassword("");
      setSessionMessage("");
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          (error.response?.data as { message?: string })?.message ||
          "Login gagal. Periksa email, password, atau endpoint API Anda.";
        setErrorMessage(message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (session?.token) {
    const adminName = session.user?.name || "Admin Al-Kautsar";
    const adminEmail = session.user?.email || email || "-";
    const adminRole = session.user?.role || "admin";

    return (
      <main className="admin-shell">
        <section className="admin-dashboard">
          <aside className="admin-sidebar">
            <div className="admin-brand">
              <div className="admin-brand__icon">AK</div>
              <div>
                <strong>Admin Panel</strong>
                <span>Al-Kautsar School</span>
              </div>
            </div>

            <nav className="admin-nav">
              <button
                type="button"
                className={`admin-nav__item ${activeMenu === "overview" ? "admin-nav__item--active" : ""}`}
                onClick={() => setActiveMenu("overview")}
              >
                Overview
              </button>
              <button
                type="button"
                className={`admin-nav__item ${activeMenu === "students" ? "admin-nav__item--active" : ""}`}
                onClick={() => setActiveMenu("students")}
              >
                Data Siswa
              </button>
              <button
                type="button"
                className={`admin-nav__item ${activeMenu === "content" ? "admin-nav__item--active" : ""}`}
                onClick={() => setActiveMenu("content")}
              >
                Konten Website
              </button>
              <button
                type="button"
                className={`admin-nav__item ${activeMenu === "reports" ? "admin-nav__item--active" : ""}`}
                onClick={() => setActiveMenu("reports")}
              >
                Laporan
              </button>
              <button
                type="button"
                className={`admin-nav__item ${activeMenu === "settings" ? "admin-nav__item--active" : ""}`}
                onClick={() => setActiveMenu("settings")}
              >
                Pengaturan
              </button>
            </nav>

            <div className="admin-profile-card">
              <span className="admin-profile-card__label">Login sebagai</span>
              <strong>{adminName}</strong>
              <p>{adminEmail}</p>
              <div className="admin-profile-card__role">{adminRole}</div>
            </div>

            <button
              type="button"
              className="admin-button admin-button--ghost"
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          </aside>

          <div className="admin-content">
            {activeMenu === "overview" ? (
              <>
                <header className="admin-hero">
                  <div>
                    <div className="admin-badge">Dashboard Admin</div>
                    <h1>Selamat datang kembali, {adminName}</h1>
                    <p className="admin-description">
                      Pantau performa website sekolah, aktivitas admin, dan
                      buka menu CRUD konten untuk mengelola landing page.
                    </p>
                  </div>

                  <div className="admin-hero__highlight">
                    <span>Performa minggu ini</span>
                    <strong>87% stabil</strong>
                    <p>Traffic naik dan pendaftaran baru terus bertambah.</p>
                  </div>
                </header>

                <section className="admin-metrics">
                  {adminMetrics.map((item) => (
                    <article key={item.label} className="admin-metric-card">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                      <em>{item.trend}</em>
                      <p>{item.detail}</p>
                    </article>
                  ))}
                </section>

                <section className="admin-grid">
                  <article className="admin-card admin-card--chart">
                    <div className="admin-card__header">
                      <div>
                        <span className="admin-card__eyebrow">Analitik</span>
                        <h2>Grafik pengunjung website</h2>
                      </div>
                      <strong>7 bulan terakhir</strong>
                    </div>

                    <svg
                      className="admin-chart"
                      viewBox="0 0 520 220"
                      role="img"
                      aria-label="Grafik pengunjung website"
                    >
                      <defs>
                        <linearGradient id="admin-chart-fill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="rgba(15, 118, 110, 0.35)" />
                          <stop offset="100%" stopColor="rgba(15, 118, 110, 0)" />
                        </linearGradient>
                      </defs>

                      <path
                        d={`${chartPath} L 480 190 L 30 190 Z`}
                        fill="url(#admin-chart-fill)"
                      />
                      <path d={chartPath} pathLength={100} />

                      {monthlyVisitors.map((value, index) => {
                        const x = 30 + index * 75;
                        const y = 180 - ((value - 50) / 80) * 120;

                        return (
                          <g key={monthlyLabels[index]}>
                            <circle cx={x} cy={y} r="5" />
                            <text x={x} y="210" textAnchor="middle">
                              {monthlyLabels[index]}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </article>

                  <article className="admin-card">
                    <div className="admin-card__header">
                      <div>
                        <span className="admin-card__eyebrow">Aksi Cepat</span>
                        <h2>Menu penting</h2>
                      </div>
                    </div>

                    <div className="admin-action-list">
                      {quickActions.map((action) => (
                        <button
                          key={action}
                          type="button"
                          className="admin-action-item"
                          onClick={() =>
                            setActiveMenu(
                              action === "Kelola berita sekolah" ||
                                action === "Update agenda kegiatan"
                                ? "content"
                                : "reports",
                            )
                          }
                        >
                          <span>{action}</span>
                          <strong>Open</strong>
                        </button>
                      ))}
                    </div>
                  </article>

                  <article className="admin-card">
                    <div className="admin-card__header">
                      <div>
                        <span className="admin-card__eyebrow">Aktivitas</span>
                        <h2>Pembaruan terbaru</h2>
                      </div>
                    </div>

                    <div className="admin-activity-list">
                      {recentActivities.map((activity) => (
                        <div key={activity.title} className="admin-activity-item">
                          <div>
                            <strong>{activity.title}</strong>
                            <p>{activity.time}</p>
                          </div>
                          <span>{activity.status}</span>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="admin-card admin-card--accent">
                    <div className="admin-card__header">
                      <div>
                        <span className="admin-card__eyebrow">Agenda Hari Ini</span>
                        <h2>Jadwal tim admin</h2>
                      </div>
                    </div>

                    <div className="admin-schedule">
                      {scheduleItems.map((item) => (
                        <div key={item.title} className="admin-schedule__item">
                          <strong>{item.title}</strong>
                          <p>{item.meta}</p>
                        </div>
                      ))}
                    </div>

                    <div className="admin-token-card">
                      <span>Access Token</span>
                      <code>{session.token}</code>
                    </div>
                  </article>
                </section>
              </>
            ) : null}

            {activeMenu === "content" ? <ContentManager /> : null}

            {activeMenu === "students" ? (
              <section className="admin-card admin-placeholder">
                <div className="admin-card__header">
                  <div>
                    <span className="admin-card__eyebrow">Data Siswa</span>
                    <h2>Modul berikutnya</h2>
                  </div>
                </div>
                <p>
                  Area ini siap dipakai untuk CRUD data siswa setelah struktur
                  API-nya Anda tentukan.
                </p>
              </section>
            ) : null}

            {activeMenu === "reports" ? (
              <section className="admin-card admin-placeholder">
                <div className="admin-card__header">
                  <div>
                    <span className="admin-card__eyebrow">Laporan</span>
                    <h2>Rekap performa</h2>
                  </div>
                </div>
                <p>
                  Menu laporan bisa dilanjutkan untuk statistik pendaftaran,
                  pengunjung, dan rekap konten.
                </p>
              </section>
            ) : null}

            {activeMenu === "settings" ? (
              <section className="admin-card admin-placeholder">
                <div className="admin-card__header">
                  <div>
                    <span className="admin-card__eyebrow">Pengaturan</span>
                    <h2>Konfigurasi admin</h2>
                  </div>
                </div>
                <p>
                  Di sini nanti bisa dipakai untuk pengaturan profil admin dan
                  konfigurasi endpoint tambahan.
                </p>
              </section>
            ) : null}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <section className="admin-panel mt-10">
        <div className="admin-badge">Admin Login</div>
        <h1>Masuk ke panel admin</h1>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="admin@alkautsar.sch.id"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="admin-field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {errorMessage ? (
            <div className="admin-alert" role="alert">
              {errorMessage}
            </div>
          ) : null}

          {sessionMessage ? (
            <div className="admin-alert admin-alert--warning" role="alert">
              {sessionMessage}
            </div>
          ) : null}

          <button
            type="submit"
            className="admin-button"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login Admin"}
          </button>
        </form>

       
      </section>
    </main>
  );
};

export default AdminPage;
