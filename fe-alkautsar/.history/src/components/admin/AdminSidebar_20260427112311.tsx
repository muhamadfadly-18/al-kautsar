import type { AdminMenu } from "./types";
const [sidebarOpen, setSidebarOpen] = useState(false);

type AdminSidebarProps = {
  activeMenu: AdminMenu;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  reportsBadgeCount?: number;
  onMenuChange: (menu: AdminMenu) => void;
  onLogout: () => void;
};

const navItems: Array<{ key: AdminMenu; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "students", label: "Data Siswa" },
  { key: "content", label: "Konten Website" },
  { key: "reports", label: "Laporan" },
  { key: "settings", label: "Pengaturan" },
];


const AdminSidebar = ({
  
  activeMenu,
  adminName,
  adminEmail,
  adminRole,
  reportsBadgeCount = 0,
  onMenuChange,
  onLogout,
  
}: AdminSidebarProps) => (
  
  <aside className="admin-sidebar">
    <div className="admin-brand">
      <div className="admin-brand__icon">AK</div>
      <div>
        <strong>Admin Panel</strong>
        <span>Al-Kautsar School</span>
      </div>
    </div>

    <nav className="admin-nav">
      {navItems.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`admin-nav__item ${activeMenu === item.key ? "admin-nav__item--active" : ""}`}
          onClick={() => onMenuChange(item.key)}
        >
          <span>{item.label}</span>
          {item.key === "reports" && reportsBadgeCount > 0 ? (
            <span className="admin-nav__badge">{reportsBadgeCount}</span>
          ) : null}
        </button>
      ))}
    </nav>

    <div className="admin-profile-card">
      <span className="admin-profile-card__label">Login sebagai</span>
      <strong>{adminName}</strong>
      <p>{adminEmail}</p>
      <div className="admin-profile-card__role">{adminRole}</div>
    </div>

    <button type="button" className="admin-button admin-button--ghost" onClick={onLogout}>
      Logout
    </button>
  </aside>
);

export default AdminSidebar;
