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
        
        {/* Header: Dibuat Minimalis & Elegan */}
        <div className="row align-items-end mb-5">
          <div className="col-md-7">
            <h6 className="text-success fw-bold ls-2 text-uppercase mb-2" style={{ letterSpacing: '3px' }}>
              Our Gallery
            </h6>
            <h2 className="display-4 fw-light text-dark">
              Momen <span className="fw-bold">Berharga</span> Kami
            </h2>
          </div>
          <div className="col-md-5 text-md-end">
            <p className="text-muted border-start border-success border-3 ps-3">
              Eksplorasi dokumentasi kegiatan Al-Kautsar yang dikelola secara profesional.
            </p>
          </div>
        </div>

        {/* Gallery Grid: Menggunakan Gutter yang lebih rapat (g-3) agar terlihat menyatu */}
        <div className="row g-3">
          {gallery.map((item, index) => (
            <div 
              key={item.id} 
              className={index % 3 === 0 ? "col-lg-6 col-md-12" : "col-lg-3 col-md-6"}
            >
              {/* Card Container */}
              <div className="position-relative overflow-hidden rounded-5 shadow-sm border-0 h-100 bg-dark group shadow-hover">
                
                {/* Image dengan overlay gradasi otomatis */}
                <div className="h-100 w-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="img-fluid w-100 h-100 object-fit-cover transition-all"
                    style={{ 
                      minHeight: "350px", 
                      maxHeight: index % 3 === 0 ? "500px" : "350px",
                      opacity: '0.85'
                    }}
                  />
                  
                  {/* Gradient Overlay: Membuat teks selalu terbaca */}
                  <div 
                    className="position-absolute bottom-0 start-0 w-100 h-100" 
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)' }}
                  ></div>

                  {/* Content Overlay */}
                  <div className="position-absolute bottom-0 start-0 p-4 w-100">
                    <div className="d-flex flex-column h-100 justify-content-end align-items-start">
                      <span className="badge bg-success mb-2 px-3 py-2 rounded-pill shadow-sm">
                        {item.category}
                      </span>
                      <h4 className="text-white fw-bold mb-1">{item.title}</h4>
                      <p className="text-white-50 small mb-0 opacity-0 transform-translate-y transition-all group-hover-visible">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                  
                  {/* Link Invisible */}
                  <a href="#" className="stretched-link"></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline Styling untuk Efek yang tidak ada di Class Bootstrap */}
      <style>{`
        .group:hover img {
          transform: scale(1.08);
          opacity: 1 !important;
        }
        .transition-all {
          transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .group-hover-visible {
          max-height: 0;
          overflow: hidden;
        }
        .group:hover .group-hover-visible {
          max-height: 100px;
          opacity: 1 !important;
          margin-top: 10px;
        }
        .shadow-hover {
          transition: box-shadow 0.3s ease-in-out;
        }
        .shadow-hover:hover {
          box-shadow: 0 1rem 3rem rgba(0,0,0,0.2) !important;
        }
      `}</style>
    </section>
  );
};

export default GallerySection;