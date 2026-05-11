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
    <section className="py-5 bg-light" id="gallery">
      <div className="container py-lg-4">
        {/* Header Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <span className="badge text-bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-bold text-uppercase mb-3">
              Koleksi Foto
            </span>
            <h2 className="display-5 fw-bold text-dark mb-3">Momen Al-Kautsar</h2>
            <p className="lead text-muted">
              Dokumentasi kegiatan dan fasilitas yang dikelola langsung melalui sistem cloud kami.
            </p>
            <div className="mx-auto bg-success opacity-25" style={{ width: "80px", height: "4px", borderRadius: "2px" }}></div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="row g-4">
          {gallery.map((item) => (
            <div key={item.id} className="col-sm-6 col-lg-4 col-xl-3">
              <div className="card h-100 border-0 shadow-sm overflow-hidden rounded-4 transition-all hover-shadow-lg">
                {/* Image Container with Aspect Ratio */}
                <div className="position-relative overflow-hidden group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="card-img-top object-fit-cover transition-transform duration-500"
                    style={{ height: "240px" }}
                  />
                  {/* Glassmorphism Badge Overlay */}
                  <div className="position-absolute top-0 start-0 m-3">
                    <span className="badge bg-white bg-opacity-75 text-dark backdrop-blur py-2 px-3 rounded-pill shadow-sm small fw-bold">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="card-body p-4">
                  <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                  <p className="card-text text-muted small lh-base">
                    {item.caption}
                  </p>
                </div>
                
                {/* Footer link subtle */}
                <div className="card-footer bg-transparent border-0 pt-0 pb-4 px-4">
                   <a href="#" className="btn btn-link text-success p-0 text-decoration-none fw-semibold small stretched-link">
                     Lihat Detail <i className="bi bi-arrow-right ms-1"></i>
                   </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;