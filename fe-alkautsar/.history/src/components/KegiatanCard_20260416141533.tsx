import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Pastikan import bootstrap JS di entry point atau di sini untuk modal
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import type { ActivityItem } from "../data/homeContent";
import { defaultHomeContent } from "../data/homeContent";

type KegiatanPageProps = {
  items?: ActivityItem[];
};

const KegiatanPage = ({ items = defaultHomeContent.activities }: KegiatanPageProps) => {
  const kegiatan = items.length > 0 ? items : defaultHomeContent.activities;
  const [activeItem, setActiveItem] = useState<ActivityItem | null>(null);

  return (
    <section id="kegiatan" className="py-5 bg-dark text-white">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h6 className="text-success fw-bold text-uppercase tracking-wider">
            Agenda Terdekat
          </h6>
          <h2 className="display-4 fw-bold">Kegiatan Kami</h2>
          <hr className="mx-auto border-success border-3 opacity-100" style={{ width: "60px" }} />
        </div>

        {/* Grid Kegiatan */}
        <div className="row g-4">
          {kegiatan.map((item) => (
            <div key={item.id} className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 bg-secondary bg-opacity-25 text-white overflow-hidden shadow">
                <div className="position-relative overflow-hidden group">
                  <img
                    src={item.image}
                    className="card-img-top object-fit-cover"
                    alt={item.title}
                    style={{ height: "250px", transition: "transform .3s ease" }}
                  />
                  {/* Overlay on Hover menggunakan class utility Bootstrap */}
                  <div className="card-img-overlay d-flex flex-column align-items-center justify-content-center bg-dark bg-opacity-50 opacity-0 transition-all hover-opacity-100">
                    <button
                      onClick={() => setActiveItem(item)}
                      className="btn btn-outline-light rounded-pill px-4"
                      data-bs-toggle="modal"
                      data-bs-target="#kegiatanModal"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
                <div className="card-body text-center">
                  <span className="badge bg-success mb-2">{item.category}</span>
                  <h5 className="card-title fw-bold">{item.title}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bootstrap Modal */}
      <div 
        className="modal fade" 
        id="kegiatanModal" 
        tabIndex={-1} 
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content bg-dark text-white border-secondary">
            <div className="modal-header border-secondary">
              <h5 className="modal-title fw-bold text-success">{activeItem?.category}</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                data-bs-dismiss="modal" 
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-0">
              {activeItem && (
                <div className="row g-0">
                  <div className="col-md-6">
                    <img 
                      src={activeItem.image} 
                      className="img-fluid w-100 h-100 object-fit-cover" 
                      alt={activeItem.title} 
                      style={{ minHeight: "300px" }}
                    />
                  </div>
                  <div className="col-md-6 p-4 d-flex flex-column justify-content-center">
                    <h3 className="fw-bold mb-3">{activeItem.title}</h3>
                    <div className="d-flex align-items-center mb-3 text-info">
                      <i className="bi bi-calendar3 me-2"></i>
                      <span>{activeItem.date}</span>
                    </div>
                    <p className="text-secondary-emphasis">
                      {activeItem.desc}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KegiatanPage;