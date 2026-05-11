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
    <section className="py-5" id="gallery">
      <div className="container">
        <div className="text-center mb-5">
          <h6 className="text-uppercase fw-bold text-success mb-2">Gallery</h6>
          <h2 className="display-5 fw-bold text-dark">Momen Al-Kautsar</h2>
          <p className="text-muted mx-auto mt-3" style={{ maxWidth: "680px" }}>
            Semua foto di bawah ini sekarang diambil dari API konten, jadi bisa
            Anda kelola langsung dari halaman admin.
          </p>
        </div>

        <div className="row g-4">
          {gallery.map((item) => (
            <div key={item.id} className="col-lg-3 col-md-6">
              <article className="h-100 rounded-5 overflow-hidden shadow-sm border border-light-subtle bg-white">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-100"
                  style={{ height: "260px", objectFit: "cover" }}
                />
                <div className="p-4">
                  <span className="badge rounded-pill text-bg-success-subtle text-success-emphasis mb-3">
                    {item.category}
                  </span>
                  <h3 className="h5 fw-bold text-dark">{item.title}</h3>
                  <p className="text-muted mb-0">{item.caption}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
