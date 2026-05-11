type AdminLoginViewProps = {
  email: string;
  password: string;
  loading: boolean;
  errorMessage: string;
  sessionMessage: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
};

const AdminLoginView = ({
  email,
  password,
  loading,
  errorMessage,
  sessionMessage,
  onSubmit,
  onEmailChange,
  onPasswordChange,
}: AdminLoginViewProps) => (
  <main className="admin-shell">
    <section className="admin-panel mt-5">
      <div className="admin-badge">Admin Login</div>
      <h1 style={{ =text}}>Masuk</h1>

      <form className="admin-form" onSubmit={onSubmit}>
        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            placeholder="admin@alkautsar.sch.id"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            required
          />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
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

        <button type="submit" className="admin-button" disabled={loading}>
          {loading ? "Memproses..." : "Login Admin"}
        </button>
      </form>
    </section>
  </main>
);

export default AdminLoginView;
