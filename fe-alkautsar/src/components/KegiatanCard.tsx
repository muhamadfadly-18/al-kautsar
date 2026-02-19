import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/kegiatan.css";

type Kegiatan = {
  title: string;
  category: string;
  img: string;
  date: string;
  desc: string;
};

const KegiatanPage = () => {
  const [activeItem, setActiveItem] = useState<Kegiatan | null>(null);

  const kegiatan: Kegiatan[] = [
    {
      title: "Pengajian Mingguan",
      category: "Ibadah",
      date: "Setiap Jumat, 19:30 WIB",
      img: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=600",
      desc: "Kajian kitab kuning dan zikir bersama untuk memperdalam spiritualitas santri dan masyarakat sekitar pondok.",
    },
    {
      title: "Pembangunan Masjid",
      category: "Sosial",
      date: "Tahap Finishing - 2026",
      img: "https://images.unsplash.com/photo-1591604129939-f1efa4d8f7ec?auto=format&fit=crop&q=80&w=600",
      desc: "Proyek perluasan area ibadah utama guna menampung lebih banyak jamaah dan fasilitas pendidikan Al-Qur'an.",
    },
    {
      title: "Kelas Mengaji Anak",
      category: "Edukasi",
      date: "Senin - Kamis",
      img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600",
      desc: "Metode belajar cepat membaca Al-Qur'an dengan tajwid yang benar untuk anak-anak usia dini.",
    },
    {
      title: "Workshop Pemuda",
      category: "Skill",
      date: "12 Maret 2026",
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
      desc: "Pelatihan kewirausahaan digital dan desain grafis bagi santri tingkat akhir untuk persiapan dunia kerja.",
    },
  ];

  return (
    <div
      className={`kegiatan-section py-5 ${activeItem ? "blur-content" : ""}`}
    >
      <div className="container position-relative z-3">
        <div className="text-center mb-5">
          <h6 className="text-success-bright fw-bold text-uppercase l-spacing mb-2">
            Agenda Terdekat
          </h6>
          <h2 className="display-5 fw-bold text-white">Kegiatan Kami</h2>
          <div className="divider-glow-green mx-auto mt-3"></div>
        </div>

        <div className="row g-4 justify-content-center">
          {kegiatan.map((item, idx) => (
            <div key={idx} className="col-lg-3 col-md-6">
              <div className="card-reveal rounded-4 overflow-hidden position-relative shadow-lg">
                <img
                  src={item.img}
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
                  <img src={activeItem.img} alt={activeItem.title} />
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

      <style>{`
        
      `}</style>
    </div>
  );
};

export default KegiatanPage;
