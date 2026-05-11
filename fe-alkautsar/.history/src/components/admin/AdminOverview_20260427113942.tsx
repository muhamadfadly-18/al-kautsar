import {
  adminMetrics,
  chartPath,
  monthlyLabels,
  monthlyVisitors,
  quickActions,
  recentActivities,
  scheduleItems,
} from "./dashboardData";
import type { AdminMenu } from "./types";

type AdminOverviewProps = {
  adminName: string;
  token: string;
  onMenuChange: (menu: AdminMenu) => void;
};

const AdminOverview = ({ adminName, token, onMenuChange }: AdminOverviewProps) => (
  <>
    <header className="admin-hero">
      <div>
      
        <h1>Selamat datang kembali, {adminName}</h1>
      
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

          <path d={`${chartPath} L 480 190 L 30 190 Z`} fill="url(#admin-chart-fill)" />
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

      
    </section>
  </>
);

export default AdminOverview;
