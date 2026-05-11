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
  <main className="login-container">
    <div className="login-card">
      
      {/* HEADER */}
      <div className="login-header">
        <img src={logoImg} alt="AL-KAUTSAR Logo" style={{ height: "45px" }} />
        <h2>Admin Panel</h2>
        <p>Masuk ke dashboard Al-Kautsar</p>
      </div>


      <form onSubmit={onSubmit} className="login-form">

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="admin@alkautsar.sch.id"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div className="alert error">{errorMessage}</div>
        )}

        {sessionMessage && (
          <div className="alert warning">{sessionMessage}</div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
    </div>
  </main>
);

export default AdminLoginView;