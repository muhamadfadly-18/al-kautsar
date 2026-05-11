import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AchievementItem } from "../data/homeContent";
import { defaultHomeContent } from "../data/homeContent";
import "../styles/prestasi.css";

type PrestasiPageProps = {
  items?: AchievementItem[];
};

const PrestasiPage = ({
  items = defaultHomeContent.achievements,
}: PrestasiPageProps) => {
  const prestasi = items.length > 0 ? items : defaultHomeContent.achievements;
  const [selectedItem, setSelectedItem] = useState<AchievementItem | null>(null);
  const isOverflow = prestasi.length > 4;

  return (
    <section id="prestasi">
    <div className={`prestasi-wrapper ${selectedItem ? "modal-open" : ""}`}>
      <div className="gradient-bg">
        <div className="mesh-glow top-left"></div>
        <div className="mesh-glow bottom-right"></div>
      </div>

      <div className="main-content-locked container-fluid d-flex flex-column justify-content-center py-4">
        <div className="text-center mb-5 mt-2">
          <h6 className="text-uppercase fw-bold text-gold ls-4 mb-2 animate-fade-down">
            Our Hall of Fame
          </h6>
          <h2 className="display-4 fw-bold text-white header-title">
            Prestasi Kebanggaan
          </h2>
          <div className="divider-glow mx-auto mt-3"></div>
        </div>

        <div className="container">
          <div
            className={`row g-4 justify-content-center ${isOverflow ? "allow-scroll" : "no-scroll"}`}
          >
            {prestasi.map((item) => (
              <div key={item.id} className="col-lg-3 col-md-6 col-sm-12">
                <div className="prestasi-card shadow-2xl">
                  <div className="year-pill">{item.year}</div>
                  <div className="img-reveal">
                    <img src={item.img} alt={item.title} className="card-img" />
                  </div>
                  <div className="card-content">
                    <span className="badge-cat">{item.category}</span>
                    <h5 className="text-white fw-bold mb-3">{item.title}</h5>
                    <button
                      className="btn-glass"
                      onClick={() => setSelectedItem(item)}
                    >
                      Detail <i className="bi bi-chevron-right ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div
          className="custom-modal-overlay"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="custom-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setSelectedItem(null)}>
              &times;
            </button>
            <div className="row g-0">
              <div className="col-md-5">
                <div className="modal-img-container">
                  <img src={selectedItem.img} alt={selectedItem.title} />
                  <div className="modal-year-tag">{selectedItem.year}</div>
                </div>
              </div>
              <div className="col-md-7 d-flex align-items-center">
                <div className="p-4 p-md-5">
                  <span className="badge-cat mb-2 d-inline-block">
                    {selectedItem.category}
                  </span>
                  <h2 className="text-white fw-bold mb-4 modal-title">
                    {selectedItem.title}
                  </h2>
                  <p className="text-light-muted mb-5 lh-lg">
                    {selectedItem.desc}
                  </p>
                  <div className="modal-footer-decoration">
                    <div className="gold-line"></div>
                    <span className="text-gold small fw-bold ls-2">
                      EXCELLENCE ACHIEVEMENT
                    </span>
                  </div>
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

export default PrestasiPage;
