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
      <div className="container py-5">
        
        {/* Header: Super Minimalist */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-gold display-6 mb-2">Galeri Foto</h2>
          <p className="text-muted small text- fw-semibold ls-2">Dokumentasi Terkini Al-Kautsar</p>
        </div>

        {/* Grid: Rapi & Teratur */}
        <div className="row g-4">
          {gallery.map((item) => (
            <div key={item.id} className="col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden gallery-card-v3">
                
                {/* Image Box */}
                <div className="position-relative overflow-hidden" style={{ height: "240px" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-100 h-100 object-fit-cover img-zoom"
                  />
                  <div className="badge-overlay position-absolute top-0 end-0 m-3">
                    <span className="badge bg-white text-success rounded-pill px-3 shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Info Box: Minimalis */}
                <div className="card-body p-3 text-center">
                  <h6 className="fw-bold text-dark mb-1">{item.title}</h6>
                  <small className="text-muted d-block">{item.caption}</small>
                </div>

                <a href="#" className="stretched-link"></a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* Spacing antar huruf untuk kesan mewah */
        .ls-2 { letter-spacing: 2px; }

        /* Card Shadow yang sangat halus */
        .gallery-card-v3 {
          transition: all 0.3s ease-in-out;
          background: #ffffff;
        }

        .gallery-card-v3:hover {
          transform: translateY(-8px);
          shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
        }

        /* Zoom halus pada gambar */
        .img-zoom {
          transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .gallery-card-v3:hover .img-zoom {
          transform: scale(1.1);
        }

        /* Overlay badge muncul perlahan */
        .badge-overlay {
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .gallery-card-v3:hover .badge-overlay {
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default GallerySection;