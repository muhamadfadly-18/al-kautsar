import "bootstrap/dist/css/bootstrap.min.css";
import type { GalleryItem } from "../data/homeContent";
import { defaultHomeContent } from "../data/homeContent";

type GallerySectionProps = {
  items?: GalleryItem[];
};

const GallerySection = ({
  items = defaultHomeContent.gallery,
}: GallerySectionProps) => {
  const gallery = items.length > 0 ? items : defaultHomeContent.gallery;

  return (
    <section className="py-5 bg-white" id="gallery">
      <div className="container py-4">
        
        {/* Header: Rapi & Center */}
        <div className="text-center mb-5">
          <span className="text-success fw-bold small text-uppercase tracking-widest px-3 py-1 bg-success bg-opacity-10 rounded-pill">
            Portfolio Gallery
          </span>
          <h2 className="fw-bold text-dark mt-3 mb-2">Momen Al-Kautsar</h2>
          <div className="bg-success mx-auto" style={{ width: "40px", height: "3px" }}></div>
        </div>

        {/* Grid: Menggunakan g-3 (jarak kecil) agar lebih rapat & rapi */}
        <div className="row g-3">
          {gallery.map((item) => (
            <div key={item.id} className="col-6 col-md-4 col-lg-3">
              {/* Card Container */}
              <div className="gallery-card position-relative overflow-hidden rounded-4 shadow-sm border-0 ratio ratio-1x1 bg-light">
                
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="img-fluid object-fit-cover transition-all"
                />

                {/* Overlay: Hanya muncul saat di-hover dengan transisi lembut */}
                <div className="gallery-overlay position-absolute w-100 h-100 d-flex flex-column justify-content-end p-3 text-white">
                  <div className="overlay-content translate-y-20 transition-all opacity-0">
                    <p className="small mb-0 opacity-75">{item.category}</p>
                    <h6 className="fw-bold mb-0">{item.title}</h6>
                  </div>
                  {/* Link mask */}
                  <a href="#" className="stretched-link"></a>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Style CSS Inline untuk kerapihan ekstra */}
      <style>{`
        .tracking-widest { letter-spacing: 0.15em; }
        
        /* Gambar zoom halus saat hover */
        .gallery-card:hover img {
          transform: scale(1.1);
        }

        /* Gradient gelap agar teks terbaca saat hover */
        .gallery-overlay {
          background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%);
          transition: all 0.4s ease;
          opacity: 0;
        }

        .gallery-card:hover .gallery-overlay {
          opacity: 1;
        }

        /* Efek teks naik ke atas saat di-hover */
        .translate-y-20 { transform: translateY(15px); }
        
        .gallery-card:hover .translate-y-20 {
          transform: translateY(0);
          opacity: 1 !important;
        }

        .transition-all {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Menghilangkan scrollbar horizontal jika ada margin row */
        #gallery { overflow-x: hidden; }
      `}</style>
    </section>
  );
};

export default GallerySection;