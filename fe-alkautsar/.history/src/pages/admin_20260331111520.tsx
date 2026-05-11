import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AxiosError } from "axios";
import { loginAdmin, setAuthToken, type AuthUser } from "../services/api";
import "../styles/admin.css";

const AUTH_STORAGE_KEY = "admin_auth_session";

type StoredSession = {
  token: string;
  user?: AuthUser;
};

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [session, setSession] = useState<StoredSession | null>(null);

  useEffect(() => {
    const savedSession = readStoredSession();
    setSession(savedSession);
    setAuthToken(savedSession?.token);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await loginAdmin({ email, password });
      const nextSession: StoredSession = {
        token: result.token,
        user: result.user,
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
      setAuthToken(result.token);
      setSession(nextSession);
      setPassword("");
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

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthToken();
    setSession(null);
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  if (session?.token) {
    return (
      <main className="admin-shell">
        <section className="admin-panel admin-panel--dashboard">
          <div className="admin-badge">Admin Area</div>
          <h1>Login berhasil</h1>
          <p className="admin-description">
            Session admin sudah tersimpan di browser. Halaman ini siap
            dilanjutkan untuk fitur dashboard, CRUD, atau manajemen konten.
          </p>

          <div className="admin-summary">
            <div>
              <span>Nama</span>
              <strong>{session.user?.name || "Admin"}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{session.user?.email || email || "-"}</strong>
            </div>
            <div>
              <span>Role</span>
              <strong>{session.user?.role || "admin"}</strong>
            </div>
          </div>

          <div className="admin-token-card">
            <span>Access Token</span>
            <code>{session.token}</code>
          </div>

          <button
            type="button"
            className="admin-button admin-button--ghost"
            onClick={handleLogout}
          >
            Logout
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <div className="admin-badge">Admin Login</div>
        <h1>Masuk ke panel admin</h1>
        <p className="admin-description">
          Form ini akan melakukan request ke API login backend dan menyimpan
          token auth agar route admin bisa diproteksi.
        </p>

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

          <button
            type="submit"
            className="admin-button"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login Admin"}
          </button>
        </form>

        <div className="admin-hint">
          Endpoint default: <code>/auth/login</code>
          <br />
          Base URL API: <code>VITE_API_BASE_URL</code> atau fallback ke{" "}
          <code>http://localhost:3000</code>
        </div>
      </section>
    </main>
  );
};

export default AdminPage;
