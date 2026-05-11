import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import type { ActivityItem } from "../data/homeContent";
import { defaultHomeContent } from "../data/homeContent";
import "../styles/kegiatan.css";

type KegiatanPageProps = {
  items?: ActivityItem[];
};

const KegiatanPage = ({ items = defaultHomeContent.activities }: KegiatanPageProps) => {
  const kegiatan = items.length > 0 ? items : defaultHomeContent.activities;
  const [activeItem, setActiveItem] = useState<ActivityItem | null>(null);

  return (
    <section id="kegiatan">
    <div
      className={`kegiatan-section py-5 ${activeItem ? "blur-content" : ""}`}
    >
      <div className="container position-relative z-3">
        <div className="text-center mb-5">
          <h6 className="text-success-bright fw-bold text-uppercase l-spacing mb-2">
            Agenda Terdekat
          </h6>
          <h2 className="display-5 fw-bold text-text-success-bright">Kegiatan Kami</h2>
          <div className="divider-glow-green mx-auto mt-3"></div>
        </div>

        <div className="row g-4 justify-content-center">
          {kegiatan.map((item) => (
            <div key={item.id} className="col-lg-3 col-md-6">
              <div className="card-reveal rounded-4 overflow-hidden position-relative shadow-lg">
                <img
                  src={item.image}
                  className="img-main w-100 h-100 position-absolute"
                  alt={item.title}
                />

                <div className="overlay-content d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <span className="badge-category mb-2">{item.category}</span>
                  <h5 className="fw-bold text-white mb-3">{item.title}</h5>
                  <button
                    onClick={() => setActiveItem(item)}
                    className="btn-glass-sm"
                  >
                    Detail <i className="bi bi-plus-lg ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeItem && (
        <div className="modal-overlay" onClick={() => setActiveItem(null)}>
          <div
            className="modal-card-glass"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn-close-custom"
              onClick={() => setActiveItem(null)}
            >
              &times;
            </button>

            <div className="row g-0">
              <div className="col-md-6">
                <div className="modal-img-box">
                  <img src={activeItem.image} alt={activeItem.title} />
                  <div className="category-tag">{activeItem.category}</div>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <div className="p-4 p-md-5">
                  <h6 className="text-success-bright fw-bold mb-1">
                    DETAIL KEGIATAN
                  </h6>
                  <h2 className="text-white fw-bold mb-3">
                    {activeItem.title}
                  </h2>

                  <div className="d-flex align-items-center mb-4 text-white-50">
                    <i className="bi bi-calendar3 me-2 text-gold"></i>
                    <span>{activeItem.date}</span>
                  </div>

                  <p className="text-light-muted lh-lg mb-4">
                    {activeItem.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </section>
  );
};

export default KegiatanPage;
