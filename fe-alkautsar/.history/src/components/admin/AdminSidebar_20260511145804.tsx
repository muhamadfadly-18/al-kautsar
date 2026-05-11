import { useState } from "react";
import type { AdminMenu } from "./types";
import logoImg from "../../assets/logo.png";

type AdminSidebarProps = {
  activeMenu: AdminMenu;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  reportsBadgeCount?: number;
  onMenuChange: (menu: AdminMenu) => void;
  onLogout: () => void;
};

const navItems: { key: AdminMenu; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "bi-grid-1x2-fill" },
  { key: "students", label: "Data Siswa", icon: "bi-people-fill" },
  { key: "content", label: "Konten", icon: "bi-layout-text-window-reverse" },
  { key: "organization", label: "Organisasi", icon: "bi-diagram-3-fill" },
  { key: "reports", label: "Laporan", icon: "bi-bar-chart-fill" },
  { key: "settings", label: "Pengaturan", icon: "bi-gear-fill" },
];

const AdminSidebar = ({
  activeMenu,
  adminName,
  adminEmail,
  adminRole,
  reportsBadgeCount = 0,
  onMenuChange,
  onLogout,
}: AdminSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="mobile-header d-lg-none">
        <button
          type="button"
          className="hamburger"
          aria-label="Buka menu admin"
          onClick={() => setIsOpen(true)}
        >
          <i className="bi bi-list" />
        </button>

        <div className="mobile-header__title">
          <span className="admin-badge">Admin Panel</span>
          <h2>Dashboard</h2>
        </div>
      </div>

      {isOpen ? <div className="overlay" onClick={() => setIsOpen(false)} /> : null}

      <aside className={`admin-sidebar ${isOpen ? "active" : ""}`}>
        <button
          type="button"
          className="admin-sidebar__close d-lg-none"
          aria-label="Tutup menu admin"
          onClick={() => setIsOpen(false)}
        >
          <i className="bi bi-x-lg" />
        </button>

        <div className="admin-brand">
          <img src={logoImg} alt="AL-KAUTSAR Logo" className="admin-brand__logo" />
          <div className="admin-brand__text">
            <strong>Admin Panel</strong>
            <span>Al-Kautsar School</span>
          </div>
        </div>

        

        <nav className="admin-nav">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.key}
              className={`admin-nav__item ${activeMenu === item.key ? "active" : ""}`}
              onClick={() => {
                onMenuChange(item.key);
                setIsOpen(false);
              }}
            >
              <div className="nav-left">
                <span className="nav-icon">
                  <i className={`bi ${item.icon}`} />
                </span>
                <span className="nav-label">{item.label}</span>
              </div>

              {item.key === "reports" && reportsBadgeCount > 0 ? (
                <span className="admin-nav__badge">{reportsBadgeCount}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="admin-button admin-button--ghost admin-logout-button"
          onClick={onLogout}
        >
          <i className="bi bi-box-arrow-right" />
          Logout
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;
