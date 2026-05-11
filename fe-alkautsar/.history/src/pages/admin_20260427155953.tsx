import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AxiosError } from "axios";
import { loginAdmin, setAuthToken } from "../services/admin/auth";
import {
  getLatestPpdbSeenAt,
  getPpdbSummary,
} from "../services/admin/reports";
import AdminLoginView from "../components/admin/AdminLoginView";
import AdminOverview from "../components/admin/AdminOverview";
import AdminPlaceholderSection from "../components/admin/AdminPlaceholderSection";
import AdminSidebar from "../components/admin/AdminSidebar";
import ContentManager from "../components/admin/content";
import PpdbReports from "../components/admin/reports";
import StudentManager from "../components/admin/students";
import type { AdminMenu, StoredSession } from "../components/admin/types";
import "../styles/admin.css";

const AUTH_STORAGE_KEY = "admin_auth_session";
const REPORT_LAST_SEEN_KEY = "ppdb_reports_last_seen_at";
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;
const SESSION_EXPIRED_MESSAGE =
  "Session habis karena tidak ada aktivitas selama 5 menit. Silakan login lagi.";

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
  const [activeMenu, setActiveMenu] = useState<AdminMenu>("overview");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");
  const [session, setSession] = useState<StoredSession | null>(null);
  const [reportsBadgeCount, setReportsBadgeCount] = useState(0);
  const idleTimeoutRef = useRef<number | null>(null);
  const badgeRequestRef = useRef(0);

  const markReportsAsSeen = (seenAt = new Date().toISOString()) => {
    localStorage.setItem(REPORT_LAST_SEEN_KEY, seenAt);
    setReportsBadgeCount(0);
    return seenAt;
  };

  const handleMenuChange = (menu: AdminMenu) => {
    setActiveMenu(menu);

    if (menu === "reports") {
      const lastSeenAt = markReportsAsSeen();

      void (async () => {
        try {
          const result = await getPpdbSummary(lastSeenAt);
          markReportsAsSeen(getLatestPpdbSeenAt(result.items, lastSeenAt));
        } catch {
          markReportsAsSeen(lastSeenAt);
        }
      })();
    }
  };

  useEffect(() => {
    const savedSession = readStoredSession();
    setSession(savedSession);
    setAuthToken(savedSession?.token);
  }, []);

  useEffect(() => {
    if (!session?.token) {
      setReportsBadgeCount(0);
      return;
    }

    if (activeMenu === "reports") {
      setReportsBadgeCount(0);
      return;
    }

    const loadPpdbBadge = async () => {
      const requestId = badgeRequestRef.current + 1;
      badgeRequestRef.current = requestId;

      try {
        const lastSeenAt = localStorage.getItem(REPORT_LAST_SEEN_KEY);
        const result = await getPpdbSummary(lastSeenAt);

        if (badgeRequestRef.current !== requestId) {
          return;
        }

        setReportsBadgeCount(activeMenu === "reports" ? 0 : result.summary.baru);
      } catch {
        if (badgeRequestRef.current === requestId) {
          setReportsBadgeCount(0);
        }
      }
    };

    void loadPpdbBadge();
  }, [session?.token, activeMenu]);

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

  const handleSessionExpired = useEffectEvent(() => {
    handleLogout(SESSION_EXPIRED_MESSAGE);
  });

  useEffect(() => {
    if (!session?.token) {
      clearIdleTimeout();
      return;
    }

    const resetIdleTimer = () => {
      clearIdleTimeout();
      idleTimeoutRef.current = window.setTimeout(() => {
        handleSessionExpired();
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
      handleMenuChange("overview");
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

    const renderActiveContent = () => {
      switch (activeMenu) {
        case "overview":
          return (
            <AdminOverview
              adminName={adminName}
              token={session.token}
              onMenuChange={handleMenuChange}
            />
          );
        case "content":
          return <ContentManager />;
        case "students":
          return <StudentManager />;
        case "reports":
          return <PpdbReports onUnreadChange={setReportsBadgeCount} />;
        case "settings":
          return (
            <AdminPlaceholderSection
              eyebrow="Pengaturan"
              title="Konfigurasi admin"
              description="Di sini nanti bisa dipakai untuk pengaturan profil admin dan konfigurasi endpoint tambahan."
            />
          );
        default:
          return null;
      }
    };

    return (
      <main className="admin-shell">
        <section className="admin-dashboard">
          <AdminSidebar
            activeMenu={activeMenu}
            adminName={adminName}
            adminEmail={adminEmail}
            adminRole={adminRole}
            reportsBadgeCount={reportsBadgeCount}
            onMenuChange={handleMenuChange}
            onLogout={() => handleLogout()}
          />

          <div className="admin-content">{renderActiveContent()}</div>
        </section>
      </main>
    );
  }

  return (
    <AdminLoginView
      email={email}
      password={password}
      loading={loading}
      errorMessage={errorMessage}
      sessionMessage={sessionMessage}
      onSubmit={handleSubmit}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
    />
  );
};

export default AdminPage;
