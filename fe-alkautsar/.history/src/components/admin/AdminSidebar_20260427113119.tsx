import { useState } from "react";
import type { AdminMenu } from "./types";

type AdminSidebarProps = {
  activeMenu: AdminMenu;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  reportsBadgeCount?: number;
  onMenuChange: (menu: AdminMenu) => void;
  onLogout: () => void;
};

const navItems = [
  { key: "overview", label: "Overview", icon: "🏠" },
  { key: "students", label: "Data Siswa", icon: "👨‍🎓" },
  { key: "content", label: "Konten", icon: "📝" },
  { key: "reports", label: "Laporan", icon: "📊" },
  { key: "settings", label: "Pengaturan", icon: "⚙️" },
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
      {/* HEADER MOBILE */}
      <div className="mobile-header">
        <button className="hamburger" onClick={() => setIsOpen(true)}>
          ☰
        </button>
        <h2>Dashboard</h2>
      </div>

      {/* OVERLAY */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${isOpen ? "active" : ""}`}>
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
              className={`admin-nav__item ${
                activeMenu === item.key ? "admin-nav__item--active" : ""
              }`}
              onClick={() => {
                onMenuChange(item.key as AdminMenu);
                setIsOpen(false);
              }}
            >
              <span>{item.label}</span>

              {item.key === "reports" && reportsBadgeCount > 0 && (
                <span className="admin-nav__badge">
                  {reportsBadgeCount}
                </span>
              )}
            </button>
          ))}
        </nav>

       
        <button className="admin-button admin-button--ghost" onClick={onLogout}>
          Logout
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;