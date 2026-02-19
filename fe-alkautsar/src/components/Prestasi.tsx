import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/prestasi.css";

type Prestasi = {
  title: string;
  year: string;
  category: string;
  img: string;
  desc?: string;
};

const PrestasiPage = () => {
  const [selectedItem, setSelectedItem] = useState<Prestasi | null>(null);

  const prestasi: Prestasi[] = [
    {
      title: "Juara 1 Lomba Tahfidz",
      year: "2025",
      category: "Provinsi",
      img: "https://images.unsplash.com/photo-1544717305-996b815c338c?auto=format&fit=crop&q=80&w=600",
      desc: "Keberhasilan luar biasa dalam menghafal 30 Juz Al-Qur'an dengan tajwid yang sempurna.",
    },
    {
      title: "Juara 2 Olimpiade Sains",
      year: "2024",
      category: "Nasional",
      img: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600",
      desc: "Kompetisi sains tingkat nasional.",
    },
    {
      title: "Sekolah Berprestasi",
      year: "2025",
      category: "Kabupaten",
      img: "https://images.unsplash.com/photo-1523050853064-0097f4749f96?auto=format&fit=crop&q=80&w=600",
      desc: "Penghargaan atas dedikasi sekolah.",
    },
    {
      title: "Juara Lomba Seni Islami",
      year: "2023",
      category: "Provinsi",
      img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=600",
      desc: "Kreativitas modern dalam nilai Islami.",
    },
  ];

  // Cek jika data lebih dari 4 untuk mengaktifkan scroll
  const isOverflow = prestasi.length > 4;

  return (
    <div className={`prestasi-wrapper ${selectedItem ? "modal-open" : ""}`}>
      <div className="gradient-bg">
        <div className="mesh-glow top-left"></div>
        <div className="mesh-glow bottom-right"></div>
      </div>

      {/* Main Container dikunci ke 100vh */}
      <div className="main-content-locked container-fluid d-flex flex-column justify-content-center py-4">
        {/* Header */}
        <div className="text-center mb-5 mt-2">
          <h6 className="text-uppercase fw-bold text-gold ls-4 mb-2 animate-fade-down">
            Our Hall of Fame
          </h6>
          <h2 className="display-4 fw-bold text-white header-title">
            Prestasi Kebanggaan
          </h2>
          <div className="divider-glow mx-auto mt-3"></div>
        </div>

        {/* Grid Card - Kita gunakan row normal tapi bungkus agar tidak lari ke samping */}
        <div className="container">
          <div
            className={`row g-4 justify-content-center ${isOverflow ? "allow-scroll" : "no-scroll"}`}
          >
            {prestasi.map((item, idx) => (
              <div key={idx} className="col-lg-3 col-md-6 col-sm-12">
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

      {/* MODAL (Tetap sama) */}
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
  );
};

export default PrestasiPage;
